import { View, $at } from '../view'

// Create the root selector for the view...
const $ = $at('#menu-screen');

export class MenuScreen extends View {
    // Specify the root view element.
    // When set, it will be used to show/hide the view on mount and unmount.
    el = $();

    // Ad-hoc $-queries must be avoided.
    // You've got dumb 120MHz MCU with no JIT in VM, thus everything you do is expensive.
    // Put all of your elements here, like this:

    // otherEl = $( '#other-el-id' );
    // elementsArray = $( '.other-el-class' );

    // Lifecycle hook executed on `view.mount()`.
    onMount() {
        // TODO: insert subviews...
        // TODO: subscribe for events...
    }

    // Lifecycle hook executed on `view.unmount()`.
    onUnmount() {
        // TODO: unsubscribe from events...
        this.trash = null;
    }

    // Custom UI update logic, executed on `view.render()`.
    onRender() {
        // TODO: put DOM manipulations here...
        // Call this.render() to update UI.
    }
}
