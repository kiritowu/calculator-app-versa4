/*
 * Entry point for the watch app
 */
import * as document from "document";

import { id2Symbol, opsMethods } from "./enums";

function main() {
    const numberConsole = document.getElementById("numbers");
    let stage = undefined;

    function appendSymbol(id) {
        console.log("appending " + id);
        for (let opsMethod of Object.keys(opsMethods)) {
            // Fallback to use for of since includes is not available
            if (id === opsMethod) {
                // if (Object.keys(symbol2Id).includes(numberConsole.text) && stage !== undefined) {
                //     // Replace operator
                //     stage = {
                //         num: stage.num,
                //         ops: opsMethods[id],
                //         nextStage: stage.nextStage
                //     }
                //     return;
                // }
                // Stage operator
                stage = { num: parseFloat(numberConsole.text), ops: opsMethods[id], nextStage: stage };
                numberConsole.text = id2Symbol[id];
                return;
            }
        }
        // Append number symbol
        numberConsole.text += id2Symbol[id];
    }


    function resolveOps(rightNum, stage) {
        // Recursion to eval ops
        console.log(rightNum)
        if (stage === undefined) {
            return rightNum;
        }
        const { num, ops, nextStage } = stage;
        const leftNum = resolveOps(num, nextStage);
        return ops(leftNum, rightNum);
    }


    function backspace() {
        numberConsole.text = numberConsole.text.slice(0, -1);
    }

    function flush() {
        numberConsole.text = "";
        stage = undefined;
    }

    Object.keys(id2Symbol).forEach(id => {
        // TODO: vibrate and change opacity on mousedown
        document.getElementById(id).addEventListener("click", (evt) => {
            // TODO: remove debug statement
            console.log(`click ${id}`);
            appendSymbol(id);
        });
    })

    document.getElementById("equal").addEventListener("click", (evt) => {
        console.log("click equal");
        const result = resolveOps(parseFloat(numberConsole.text.slice(1)), stage);
        numberConsole.text = result % 1 === 0 ? result : result.toPrecision(8);
        stage = undefined;
    });

    document.getElementById("back").addEventListener("click", (evt) => {
        console.log("click back");
        backspace();
    });

    document.getElementById("clear").addEventListener("click", (evt) => {
        console.log("click clear");
        flush();
    });
}

main();
