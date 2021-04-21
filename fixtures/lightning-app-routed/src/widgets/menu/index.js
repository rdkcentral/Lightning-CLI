import { Lightning, Router } from '@lightningjs/sdk'

export default class Menu extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      w: 400,
      h: 1920,
      color: 0xff6999b8,
      x: -80,
      Label: {
        x: 200,
        y: 200,
        mount: 0.5,
        text: {
          text: 'menu widget',
          fontSize: 29,
        },
      },
      Status: {
        x: 200,
        y: 230,
        alpha: 0.5,
        FocusInfo: {
          mount: 0.5,
          text: {
            text: 'not focused',
            fontSize: 23,
          },
        },
        NavigateInfo: {
          mount: 0.5,
          y: 30,
          alpha: 0,
          text: {
            text: 'Press right to close',
            fontSize: 19,
          },
        },
      },
    }
  }

  _focus() {
    this.patch({
      smooth: {
        color: 0xff3298d9,
        x: 0,
      },
      Status: {
        smooth: { scale: 1.5, y: 240, alpha: 1 },
        FocusInfo: {
          text: {
            text: 'has focus',
          },
        },
        NavigateInfo: {
          smooth: { alpha: 1 },
        },
      },
    })
  }

  _unfocus() {
    this.patch({
      smooth: {
        color: 0xff016db1,
        x: -80,
      },
      Status: {
        smooth: { scale: 1, y: 230, alpha: 0.5 },
        FocusInfo: {
          text: {
            text: 'not focussed',
          },
        },
        NavigateInfo: {
          smooth: { alpha: 0 },
        },
      },
    })
  }

  _handleRight() {
    Router.focusPage()
  }
}
