/*
 * Entry point for the companion app
 */

import { outbox } from "file-transfer"
import * as messaging from "messaging";
import bufferify from 'json-bufferify';
console.log("Companion code started");

const APIKEY = "1762d260fe76c904bc5097de";
const ENDPOINT = `https://v6.exchangerate-api.com/v6/${APIKEY}/latest`
const destFilename = "exchange-rate.json";
const supportedCurrency = [
	"SGD", "MYR", "AED", "ARS", "AUD", "BGN", "BHD", "BRL",
	"CAD", "CHF", "CLP", "CNY", "COP", "CZK", "DKK", "EUR",
	"GBP", "HKD", "HUF", "IDR", "ILS", "INR", "JPY", "KRW",
	"MXN", "NOK", "NZD", "PEN", "PHP", "PLN", "RON", "RUB",
	"SAR", "SEK", "THB", "TRY", "TWD", "USD", "ZAR"
]

function queryExchangeRate() {
	let rates = {};
	const promises = supportedCurrency.map(async baseCurrencyISO => {
		return fetch(ENDPOINT + `/${baseCurrencyISO}`).then(res => {
			if (!res.ok) {
				throw new Error(`Response status: ${res.status}`);
			}
			return res.json();
		}).then(data => {
			if (data["result"] !== "success") {
				throw new Error(`Result status: ${data["result"]}`);
			}
			rates[baseCurrencyISO] = {};
			for (const currency of supportedCurrency) {
				rates[baseCurrencyISO][currency] = data["conversion_rates"][currency];
			};
		}).catch((err) => {
			console.error(`Error fetching weather: ${err}`);
		});
	});

	Promise.all(promises).then(() => {
		const buffer = stringToUint(rates).buffer;
		returnExchangeRateData(buffer);
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

function returnExchangeRateData(buffer) {
	outbox.enqueue(destFilename, buffer).then(ft => {
		console.log(`Transfer of '${destFilename}' successfully queued.`);
	}).catch(err => {
		throw new Error(`Failed to queue '${destFilename}'. Error: ${err}`);
	});
}
// Listen for the event
messaging.peerSocket.addEventListener("message", (evt) => {
	console.log("Message received in companion");
	if (evt.data && evt.data.command === "exchangeRate") {
		queryExchangeRate();
	}
});

messaging.peerSocket.addEventListener("error", (err) => {
	console.error(`Connection error: ${err.code} - ${err.message}`);
});
