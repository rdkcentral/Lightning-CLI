import { Lightning, Router } from '@lightningjs/sdk'

export default class Search extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      w: 1920,
      h: 1080,
      color: 0xff173f5f,
      Label: {
        x: 960,
        y: 540,
        mount: 0.5,
        text: {
          text: ' - Search - ',
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
          text:
            'press left to focus on menu widget\npress Up to navigate to Settings Page\nPress right to Navigate to Search with different keyword',
        },
      },
    }
  }

  _handleUp() {
    Router.navigate('settings')
  }

  _handleLeft() {
    Router.focusWidget('Menu')
  }

  _handleRight() {
    Router.navigate(`home/search/S-${~~(Math.random() * 10000)}`)
  }

  _onUrlParams(args) {
    this.tag('Label').text = `Search: ${args.keyword}`
  }

  pageTransition() {
    return 'right'
  }
}
