import { Lightning, Router } from '@lightningjs/sdk'

export default class Home extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      w: 1920,
      h: 1080,
      color: 0xff20639b,
      Label: {
        x: 960,
        y: 540,
        mount: 0.5,
        text: {
          text: 'Home',
        },
      },
      Details: {
        x: 960,
        y: 590,
        mount: 0.5,
        alpha: 0.5,
        text: {
          fontSize: 27,
          textColor: 0xdd000000,
          text: 'press up to go to the browse page',
        },
      },
    }
  }

  set persist(args) {
    console.log('we received data:', args)
  }

  _handleUp() {
    Router.navigate('home/browse/adventure')
  }
}
