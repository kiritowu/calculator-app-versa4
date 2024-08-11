import { View, $at } from '../view'
import { id2Symbol, opsMethods } from "../enums";

// Create the root selector for the view...
const $ = $at('#calculator-screen');

export class CalculatorScreen extends View {
    // Specify the root view element.
    // When set, it will be used to show/hide the view on mount and unmount.
    // Root view element used to show/hide the view.
    el = $(); // Extract #calculator-screen element.

    // Ad-hoc $-queries must be avoided.
    // You've got dumb 120MHz MCU with no JIT in VM, thus everything you do is expensive.
    // Put all of your elements here, like this:
    numberConsole = $('#numbers');
    stage = undefined;

    // Lifecycle hook executed on `view.mount()`.
    onMount() {
        // Mount event listeners
        Object.keys(id2Symbol).forEach(id => {
            // TODO: vibrate and change opacity on mousedown
            $(`#${id}`).addEventListener("click", this._appendSymbolHandler);
        })
        $("#equal").addEventListener("click", this._equalHandler);
        $("#back").addEventListener("click", this._backspaceHandler);
        $("#clear").addEventListener("click", this._clearHandler);
    }

    // Lifecycle hook executed on `view.unmount()`.
    onUnmount() {
        // Unmount local props
        this.stage = null;
        this.numberConsole.text = "";

        // Unmount event listeners
        Object.keys(id2Symbol).forEach(id => {
            // TODO: vibrate and change opacity on mousedown
            $(`#${id}`).removeEventListener("click", this._appendSymbolHandler);
        })
        $("#equal").removeEventListener("click", this._equalHandler);
        $("#back").removeEventListener("click", this._backspaceHandler);
        $("#clear").removeEventListener("click", this._clearHandler);
    }

    // Custom UI update logic, executed on `view.render()`.
    onRender() {
        // TODO: put DOM manipulations here...
        // Call this.render() to update UI.
    }

    // Private Methods for calculator logic
    _resolveOps(rightNum, stage) {
        // Recursion to evaluate equation
        if (stage === undefined) {
            return rightNum;
        }
        const { num, ops, nextStage } = stage;
        const leftNum = resolveOps(num, nextStage);
        return ops(leftNum, rightNum);
    }

    // Event Handlers
    _appendSymbolHandler(id) {
        console.log("appending " + id);
        const handler = (event) => {
            for (let opsMethod of Object.keys(opsMethods)) {
                // Fallback to use for of since includes is not available
                if (id === opsMethod) {
                    // Stage numeric operation
                    this.stage = { num: parseFloat(this.numberConsole.text), ops: opsMethods[id], nextStage: this.stage };
                    this.numberConsole.text = id2Symbol[id];
                    return;
                }
            }
            // Append number symbol
            this.numberConsole.text += id2Symbol[id];
        }
        return handler
    }

    _equalHandler(event) {
        // Calculate staged equations and write the result
        const result = this._resolveOps(parsefloat(this.numberConsole.text.slice(1)), this.stage);
        this.numberConsole.text = result % 1 === 0 ? result : result.toprecision(8);
        this.stage = undefined;
    }


    _backspaceHandler(event) {
        // Remove last character in numberConsole
        this.numberConsole.text = this.numberConsole.text.slice(0, -1);
    }

    _clearHandler(event) {
        // Clear number console and stage
        this.numberConsole.text = "";
        this.stage = undefined;
    }
}
