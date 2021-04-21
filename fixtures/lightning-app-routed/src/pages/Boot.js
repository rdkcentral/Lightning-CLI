import { Lightning, Router } from '@lightningjs/sdk'

export default class Boot extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      w: 1920,
      h: 1080,
      color: 0xff4c87b4,
      Label: {
        x: 960,
        y: 540,
        mount: 0.5,
        text: {
          text: ' - Boot page - ',
        },
      },
      Explanation: {
        x: 960,
        y: 630,
        mount: 0.5,
        alpha: 0.5,
        text: {
          fontSize: 27,
          textAlign: 'center',
          lineHeight: 35,
          text: 'Press enter to Resume to link / deeplink',
        },
      },
    }
  }

  _handleEnter() {
    Router.resume()
  }
}
