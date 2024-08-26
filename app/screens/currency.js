import * as messaging from "messaging";
import { Application, View, $at } from '../view'
import { id2Symbol } from "../enums";

// Create the root selector for the view...
const $ = $at('#currency-screen');

export class ConvCurrencyScreen extends View {
    // Specify the root view element.
    // When set, it will be used to show/hide the view on mount and unmount.
    el = $();

    screenState = "index-view";  // index-view | currency-view | numpad-view
    firstNumpadTap = true;  // Replace fromNumber completely on first tap

    // Conversion related variables
    fromNumber = 1.00;
    fromCurrency = "SGD";
    toNumber = 1.00;
    toCurrency = "MYR";

    // Elements
    // SVG
    indexSvg = $("#index-view");
    currencySvg = $("#currency-view");
    numpadSvg = $("#numpad-view");

    // Display Element
    fromCurrencyEl = $("#from-currency");
    fromNumberEl = $("#from-number");
    toCurrencyEl = $("#to-currency");
    toNumberEl = $("#to-number");
    numpadNumberEl = $("#numbers");

    // Buttons
    menuBtn = $("#menu-btn");
    settingBtn = $("#setting-btn");
    numpadBtn = $("#numpad-btn");
    resetBtn = $("#reset-btn");
    currencySelectBtn = $("#currency-select-btn");
    equalBtn = $("#equal");
    backBtn = $("#back");

    // Tumbler Element
    fromTumbler = $("#tumbler-from");
    toTumbler = $("#tumbler-to");

    // Button Handlers
    menuBtnHandler = () => {
        // Change screen to menu
        Application.switchTo('MenuScreen');
    }
    settingBtnHandler = () => {
        // Switch to setting view state
        this.screenState = "currency-view";
        this.render();
    }
    numpadBtnHandler = () => {
        // Switch to numpad view state
        this.screenState = "numpad-view";
        this.render();
    }
    resetBtnHandler = () => {
        // Reset number and rerender element
        this.fromNumber = 1.00;
        this.toNumber = 1.00;
        this.render();
    }
    currencySelectBtnHandler = () => {
        // Switch to index view state
        this.screenState = "index-view"
        this.render()
    }
    symbolHandlers = {};  // HashMap to store event listeners to be removed on unmount
    appendSymbolHandler = (id) => {
        const handler = () => {
            console.log("click " + id);
            if (this.firstNumpadTap) {
                // When first tap, replace whole number instead of append
                this.firstNumpadTap = false;
                this.numpadNumberEl.text = id2Symbol[id];
            } else {
                // Append number symbol
                this.numpadNumberEl.text += id2Symbol[id];
            }
        }
        this.symbolHandlers[id] = handler;
        return handler
    }
    equalBtnHandler = () => {
        // Switch to index view state
        this.screenState = "index-view";
        this.fromNumber = this.numpadNumberEl.text;
        const result = parseFloat(this.numpadNumberEl.text);
        this.fromNumber = result % 1 === 0 ? result : result.toFixed(2);
        this.render();
    }
    backBtnHandler = () => {
        // Remove last character in numberConsole
        console.log("back button");
        this.numpadNumberEl.text = this.numpadNumberEl.text.slice(0, -1);
    }

    // Tumbler Handler
    fromTumblerHanlder = () => {
        let selectedIndex = this.fromTumbler.value;
        let selectedItem = this.fromTumbler.getElementById(`from-${selectedIndex}`);
        let selectedISO = selectedItem.getElementById("text").text;
        this.fromCurrency = selectedISO;
        console.log(`From ${selectedISO} of index ${selectedIndex}`);
    }
    toTumblerHanlder = () => {
        let selectedIndex = this.toTumbler.value;
        let selectedItem = this.toTumbler.getElementById(`to-${selectedIndex}`);
        let selectedISO = selectedItem.getElementById("text").text;
        this.toCurrency = selectedISO;
        console.log(`From ${selectedISO} of index ${selectedIndex}`);
    }

    // Functions to fetch currency API
    handleMessagingOpen = () => {
        console.log("Ready to send or receive messages");
        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            // Send a command to the companion
            messaging.peerSocket.send({
                command: "exchangeRate"
            });
        }
    }
    handleMessagingMessage = (evt) => {
        console.log("Receive event data");
        if (evt.data) {
            console.log(`The temperature is: ${JSON.stringify(evt.data)}`);
        }
    }
    handleMessagingError = (err) => {
        console.error(`Connection error: ${err.code} - ${err.message}`);
    }

    // Lifecycle hook executed on `view.mount()`.
    onMount() {
        // Messaging socket
        messaging.peerSocket.addEventListener("open", this.handleMessagingOpen);
        messaging.peerSocket.addEventListener("message", this.handleMessagingMessage);
        messaging.peerSocket.addEventListener("error", this.handleMessagingError);
        this.handleMessagingOpen();

        // Index View
        this.menuBtn.addEventListener("click", this.menuBtnHandler);
        this.settingBtn.addEventListener("click", this.settingBtnHandler);
        this.numpadBtn.addEventListener("click", this.numpadBtnHandler);
        this.resetBtn.addEventListener("click", this.resetBtnHandler);

        // Currency View
        this.currencySelectBtn.addEventListener("click", this.currencySelectBtnHandler);
        this.fromTumbler.addEventListener("select", this.fromTumblerHanlder);
        this.toTumbler.addEventListener("select", this.toTumblerHanlder);

        // Numpad View
        Object.keys(id2Symbol).forEach(id => {
            try {
                $(`#${id}`).addEventListener("click", this.appendSymbolHandler(id));
            } catch (error) {
                console.log(`${id} is not found`);
            }
        })
        this.equalBtn.addEventListener("click", this.equalBtnHandler);
        this.backBtn.addEventListener("click", this.backBtnHandler);
    }

    // Lifecycle hook executed on `view.unmount()`.
    onUnmount() {
        // Messaging socket
        messaging.peerSocket.removeEventListener("open", this.handleMessagingOpen);
        messaging.peerSocket.removeEventListener("message", this.handleMessagingMessage);
        messaging.peerSocket.removeEventListener("error", this.handleMessagingError);

        // Index View
        this.menuBtn.removeEventListener("click", this.menuBtnHandler);
        this.settingBtn.removeEventListener("click", this.settingBtnHandler);
        this.numpadBtn.removeEventListener("click", this.numpadBtnHandler);
        this.resetBtn.removeEventListener("click", this.resetBtnHandler);

        // Currency View
        this.currencySelectBtn.removeEventListener("click", this.currencySelectBtnHandler);
        this.fromTumbler.removeEventListener("select", this.fromTumblerHanlder);
        this.toTumbler.removeEventListener("select", this.toTumblerHanlder);

        // Numpad View
        Object.keys(id2Symbol).forEach(id => {
            try {
                $(`#${id}`).removeEventListener("click", this.symbolHandlers[id]);
            } catch (error) {
                console.log(`${id} is not found`);
            }
        })
        this.equalBtn.removeEventListener("click", this.equalBtnHandler);
        this.backBtn.removeEventListener("click", this.backBtnHandler);
    }

    // Custom UI update logic, executed on `view.render()`.
    onRender() {
        if (this.screenState == "index-view") {
            this.fromNumberEl.text = this.fromNumber;
            this.fromCurrencyEl.text = this.fromCurrency;
            this.toCurrencyEl.text = this.toCurrency;
            this.toNumberEl.text = this.toNumber;

            this.indexSvg.style.display = "inline";
            this.currencySvg.style.display = "none";
            this.numpadSvg.style.display = "none";
        } else if (this.screenState == "currency-view") {
            this.indexSvg.style.display = "none";
            this.currencySvg.style.display = "inline";
            this.numpadSvg.style.display = "none";
        } else if (this.screenState == "numpad-view") {
            this.numpadNumberEl.text = this.fromNumber;
            this.firstNumpadTap = true;

            this.indexSvg.style.display = "none";
            this.currencySvg.style.display = "none";
            this.numpadSvg.style.display = "inline";
        } else {
            console.error(`screenState of ${this.screenState} is not available.`)
        }
    }
}
