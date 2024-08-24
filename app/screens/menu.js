import { Application, View, $at } from '../view'

// Create the root selector for the view...
const $ = $at('#menu-screen');

export class MenuScreen extends View {
    // Specify the root view element.
    // When set, it will be used to show/hide the view on mount and unmount.
    el = $();

    currencyButtonEl = $('#menu-button-currency');
    mutedButtonEls = $('.muted-button');

    convCurrencyHandler = () => {
        // Change screen to currency conversion
        Application.switchTo('ConvCurrencyScreen');
    }

    // Lifecycle hook executed on `view.mount()`.
    onMount() {
        this.currencyButtonEl.addEventListener("click", this.convCurrencyHandler);
    }

    // Lifecycle hook executed on `view.unmount()`.
    onUnmount() {
        this.currencyButtonEl.removeEventListener("click", this.convCurrencyHandler);
    }

    // Custom UI update logic, executed on `view.render()`.
    onRender() {
    }
}
