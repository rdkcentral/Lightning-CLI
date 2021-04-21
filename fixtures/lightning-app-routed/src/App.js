// first thing is we import the Router from the SDK
import { Router } from '@lightningjs/sdk'
// import all the configured routes
import routes from './lib/routes'
// import the actual Widget Components
import { Notification, Menu } from './widgets'

export default class App extends Router.App {
  // define which fonts are used in the App
  static getFonts() {
    return []
  }
  /**
   * Start the Router and provide with:
   * - routes configuration
   * - App instance (optional)
   */
  _setup() {
    Router.startRouter(routes, this)
  }

  static _template() {
    return {
      ...super._template(),
      Widgets: {
        // this hosts all the widgets
        Menu: {
          type: Menu,
        },
        Notification: {
          type: Notification,
        },
      },
    }
  }
  /**
   * An example of extending the Router.App StateMachine
   */
  static _states() {
    const states = super._states()
    states.push(
      class ExampleState extends this {
        $enter() {}
        $exit() {}
      }
    )
    return states
  }

  _handleAppClose() {
    console.log('Show exit dialogue')
  }
}
