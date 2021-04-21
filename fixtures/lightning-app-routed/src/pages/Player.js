import { Lightning, Router } from '@lightningjs/sdk'

export default class Player extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      w: 1920,
      h: 1080,
      color: 0xfff6d55c,
      Label: {
        x: 960,
        y: 540,
        mount: 0.5,
        text: { textAlign: 'center', lineHeight: 52, text: 'Player page', textColor: 0xff0f202b },
      },
      Explanation: {
        x: 960,
        y: 690,
        mount: 0.5,
        alpha: 0.5,
        text: {
          fontSize: 27,
          textColor: 0xee000000,
          textAlign: 'center',
          lineHeight: 39,
          text:
            'press enter to show notification\npress left to navigate to a non existing page\npress up to navigate to Search with data-provider\n press right to reload this page with different params',
        },
      },
    }
  }

  /**
   * Tell the router to do a navigate
   */
  _handleUp() {
    Router.navigate('home/search/vikings')
  }

  /**
   * Tell the router to do a navigate
   */
  _handleLeft() {
    Router.navigate('this/route/does/not/exist')
  }

  _handleRight() {
    const videoId = Math.floor(Math.random() * 300000) + 800000
    Router.navigate(`discover/player/${videoId}`)
  }

  /**
   * References to all the widgets are available via:
   * this.widgets
   * @private
   */
  _handleEnter() {
    this.widgets.notification.notify(`Widget notification for videoId: ${this._videoId}`)
  }

  _onUrlParams(args) {
    this._videoId = args.videoId
    this.tag('Label').text = `Player page \nvideoId: ${args.videoId}`
  }

  pageTransition() {
    return 'crossFade'
  }
}
