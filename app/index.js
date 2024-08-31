import document from "document";
import { Application } from './view'
import screens from './screens'

class MultiScreenApp extends Application {
    // List all screens
    screens = screens

    // "down" key handler
    onKeyDown() {
        // Switch between two screens we have.
        // Application.switchTo(this.screen.constructor === Screen1 ? 'Screen2' : 'Screen1');
    }
}

// Start the application with Screen1.
MultiScreenApp.start('CalculatorScreen');
