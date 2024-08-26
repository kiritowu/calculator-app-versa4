/*
 * Entry point for the companion app
 */

import * as messaging from "messaging";
console.log("Companion code started");

const APIKEY = "1762d260fe76c904bc5097de";
const ENDPOINT = `https://v6.exchangerate-api.com/v6/${APIKEY}/latest`
const supportedCurrency = [
	"SGD", "MYR", "AED", "ARS", "AUD", "BGN", "BHD", "BRL",
	"CAD", "CHF", "CLP", "CNY", "COP", "CZK", "DKK", "EUR",
	"GBP", "HKD", "HUF", "IDR", "ILS", "INR", "JPY", "KRW",
	"MXN", "NOK", "NZD", "PEN", "PHP", "PLN", "RON", "RUB",
	"SAR", "SEK", "THB", "TRY", "TWD", "USD", "ZAR"
]

function queryExchangeRate() {
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
			let rates = {};
			rates[baseCurrencyISO] = {};
			for (const currency of supportedCurrency) {
				rates[baseCurrencyISO][currency] = data["conversion_rates"][currency];
			};
			return returnExchangeRateData(rates);
		}).catch((err) => {
			console.error(`Error fetching weather: ${err}`);
		});
	});
};


function returnExchangeRateData(data) {
	if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
		messaging.peerSocket.send(data);
	} else {
		console.error("Error: Connection is not open");
	}
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
