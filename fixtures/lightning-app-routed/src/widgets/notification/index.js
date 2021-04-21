import { Lightning } from '@lightningjs/sdk'

export default class Notification extends Lightning.Component {
  static _template() {
    return {
      x: 100,
      y: -600,
      alpha: 1,
      Background: {
        texture: Lightning.Tools.getRoundRect(1720, 150, 20, 0, 0x00000000, true, 0xff222222),
        Message: {
          x: 80,
          y: 45,
          text: {
            text: '',
            fontSize: 40,
          },
        },
      },
    }
  }

  notify(v) {
    this.tag('Message').text = v
    this.setSmooth('y', 100, { duration: 0.7 })

    this._timeout = setTimeout(() => {
      this.setSmooth('y', -600, { duration: 1.2 })
    }, 2000)
  }

  _focus() {
    this.setSmooth('scale', 1.2)
  }

  _unfocus() {
    this.setSmooth('scale', 1)
  }
}
