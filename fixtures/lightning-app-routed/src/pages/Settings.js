import { Lightning, Router } from '@lightningjs/sdk'

export default class Settings extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      w: 1920,
      h: 1080,
      color: 0xffb93916,
      Label: {
        x: 960,
        y: 540,
        mount: 0.5,
        text: {
          text: ' - Settings - ',
        },
      },
      Explanation: {
        x: 960,
        y: 630,
        mount: 0.5,
        alpha: 0.5,
        text: {
          fontSize: 27,
          textColor: 0xaa000000,
          textAlign: 'center',
          lineHeight: 35,
          text: 'press up to navigate to Home\npress down to navigate to Page that has an Error',
        },
      },
    }
  }

  set title(v) {
    console.log('title:', v)
  }

  _handleUp() {
    Router.navigate('home', { ref: this, a: 1, b: 2 })
  }

  _handleDown() {
    Router.navigate('account/details/save', { ref: this, a: 1, b: 2 })
  }

  // https://github.com/rdkcentral/Lightning-SDK/blob/feature/router/docs/plugins/router.md#page-transitions
  pageTransition() {
    return 'down'
  }
}
