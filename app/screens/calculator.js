import { Application, View, $at } from '../view'
import { id2Symbol, opsMethods } from "../enums";

// Create the root selector for the view...
const $ = $at('#calculator-screen');

function resolveOps(rightNum, stage) {
    // Recursion to evaluate equation
    if (stage === undefined) {
        return rightNum;
    }
    const { num, ops, nextStage } = stage;
    const leftNum = resolveOps(num, nextStage);
    return ops(leftNum, rightNum);
}

export class CalculatorScreen extends View {
    // Specify the root view element.
    // When set, it will be used to show/hide the view on mount and unmount.
    // Root view element used to show/hide the view.
    el = $(); // Extract #calculator-screen element.

    numberEl = $('#numbers');
    stage = undefined;

    appendSymbolHandler = (id) => {
        console.log("appending " + id);
        const handler = () => {
            console.log("click " + id);
            for (let opsMethod of Object.keys(opsMethods)) {
                // Fallback to use for of since includes is not available
                if (id === opsMethod) {
                    // Stage numeric operation
                    this.stage = { num: parseFloat(this.numberEl.text), ops: opsMethods[id], nextStage: this.stage };
                    this.numberEl.text = id2Symbol[id];
                    return;
                }
            }
            // Append number symbol
            this.numberEl.text += id2Symbol[id];
        }
        return handler
    }

    equalHandler = () => {
        console.log("click equal");
        const result = resolveOps(parseFloat(this.numberEl.text.slice(1)), this.stage);
        this.numberEl.text = result % 1 === 0 ? result : result.toPrecision(8);
        this.stage = undefined;
    }

    backspaceHandler = () => {
        // Remove last character in numberConsole
        console.log("click backspace");
        this.numberEl.text = this.numberEl.text.slice(0, -1);
    }

    clearHandler = () => {
        // Clear number console and stage
        console.log("click clear");
        this.numberEl.text = "";
        this.stage = undefined;
    }

    menuHandler = () => {
        // Change screen to menu
        Application.switchTo('MenuScreen');
    }

    // Lifecycle hook executed on `view.mount()`.
    onMount() {
        // Mount event listeners
        Object.keys(id2Symbol).forEach(id => {
            // TODO: vibrate and change opacity on mousedown
            $(`#${id}`).addEventListener("click", this.appendSymbolHandler(id));
        })
        $("#equal").addEventListener("click", this.equalHandler);
        $("#back").addEventListener("click", this.backspaceHandler);
        $("#clear").addEventListener("click", this.clearHandler);
        $("#convert").addEventListener("click", this.menuHandler);
    }

    // Lifecycle hook executed on `view.unmount()`.
    onUnmount() {
        // Unmount local props
        this.stage = null;
        this.numberEl.text = "";

        // Unmount event listeners
        Object.keys(id2Symbol).forEach(id => {
            // TODO: vibrate and change opacity on mousedown
            $(`#${id}`).removeEventListener("click", this.appendSymbolHandler(id));
        })
        $("#equal").removeEventListener("click", this.equalHandler);
        $("#back").removeEventListener("click", this.backspaceHandler);
        $("#clear").removeEventListener("click", this.clearHandler);
        $("#convert").removeEventListener("click", this.menuHandler);
    }
    // Custom UI update logic, executed on `view.render()`.
    onRender() {
        // TODO: put DOM manipulations here...
        // Call this.render() to update UI.
    }
}

