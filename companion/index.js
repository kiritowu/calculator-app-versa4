/*
 * Entry point for the companion app
 */

import { outbox } from "file-transfer"
import { settingsStorage } from "settings";
import { me as companion } from "companion";
import * as messaging from "messaging";

console.log("Companion code started");

// Get the value of the setting
let APIKEY = settingsStorage.getItem("apiKey");
const ENDPOINT = `https://v6.exchangerate-api.com/v6`
const destFilename = "exchange-rate.json";
const supportedCurrency = [
	"SGD", "MYR", "AED", "ARS", "AUD", "BGN", "BHD", "BRL",
	"CAD", "CHF", "CLP", "CNY", "COP", "CZK", "DKK", "EUR",
	"GBP", "HKD", "HUF", "IDR", "ILS", "INR", "JPY", "KRW",
	"MXN", "NOK", "NZD", "PEN", "PHP", "PLN", "RON", "RUB",
	"SAR", "SEK", "THB", "TRY", "TWD", "USD", "ZAR"
];


function queryExchangeRate() {
	let rates = {};
	const promises = supportedCurrency.map(async baseCurrencyISO => {
		return fetch(ENDPOINT + `/${APIKEY}/latest/${baseCurrencyISO}`)
			.then(res => {
				if (!res.ok) {
					throw new Error(`Response status: ${res.status}`);
				}
				return res.json();
			})
			.then(data => {
				if (data["result"] !== "success") {
					throw new Error(`Result status: ${data["result"]}`);
				}
				rates[baseCurrencyISO] = {};
				for (const currency of supportedCurrency) {
					rates[baseCurrencyISO][currency] = data["conversion_rates"][currency];
				};
			})
			.catch((err) => {
				console.error(`Error fetching exchange rate: ${err}`);
				throw err;
			});
	});

	return Promise.all(promises).then(() => {
		const buffer = stringToUint(rates).buffer;
		returnExchangeRateFile(buffer);
	})
};


function stringToUint(object) {
	// Convert JSON object to UInt8Array
	var string = JSON.stringify(object),
		charList = string.split(''),
		uintArray = [];
	for (var i = 0; i < charList.length; i++) {
		uintArray.push(charList[i].charCodeAt(0));
	}
	return new Uint8Array(uintArray);
}

function returnExchangeRateFile(buffer) {
	outbox.enqueue(destFilename, buffer).then(ft => {
		console.log(`Transfer of '${destFilename}' successfully queued.`);
	}).catch(err => {
		throw new Error(`Failed to queue '${destFilename}'. Error: ${err}`);
	});
}

function currencyIndex(name) {
	return supportedCurrency.indexOf(name)
}

function sendSettingData(key, value) {
	// If we have a MessageSocket, send the data to the device
	if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
		messaging.peerSocket.send({ key, value });
	} else {
		console.log("No peerSocket connection");
	}
}
// Settings were changed while the companion was not running
if (companion.launchReasons.settingsChanged) {
	APIKEY = settingsStorage.getItem("apiKey")
	// Send the value of the setting
	console.log("Sending setting data on launch");
	sendSettingData("currencyFromIndex",
		settingsStorage.getItem("currencyFrom").selected[0]);
	sendSettingData("currencyToIndex",
		settingsStorage.getItem("currencyTo").selected[0]);
}

// Listen for the events
settingsStorage.addEventListener("change", (evt) => {
	if (evt.key === "apiKey") {
		APIKEY = evt.newValue;
	} else {
		console.log("Sending setting data on change");
		sendSettingData(evt.key + "Index", JSON.parse(evt.newValue).selected[0]);
	}
});

messaging.peerSocket.addEventListener("message", async (evt) => {
	console.log("Message received in companion");
	if (evt.data && evt.data.command === "exchangeRate") {
		if (APIKEY === null) {
			console.error("API Key not found in settings");
			return sendSettingData("error", "API Key not found in Setting.");
		}
		try {
			await queryExchangeRate();
		} catch (error) {
			console.error("Error query exchange rate" + error);
			return sendSettingData("error", "Error querying API data.");
		}
	}
});

messaging.peerSocket.addEventListener("error", (err) => {
	console.error(`Connection error: ${err.code} - ${err.message}`);
});
