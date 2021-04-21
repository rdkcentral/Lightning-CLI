import { Lightning, Router } from '@lightningjs/sdk'

export default class Error extends Lightning.Component {
  static _template() {
    return {
      rect: true,
      w: 1920,
      h: 1080,
      color: 0xffb70606,
      Label: {
        x: 100,
        y: 100,
        text: {
          text: 'Error',
          fontSize: 22,
        },
      },
    }
  }

  _handleEnter() {
    Router.navigate('home')
  }

  _focus() {
    console.log('focus error page')
  }

  set params(args) {
    const { request } = args
    this.error = request
  }

  set error(obj) {
    if (!obj.page) {
      this.tag('Label').text = obj.error
    } else {
      const { page, error, hash, route } = obj
      const errorMessage = `
error while loading page: ${page.constructor.name}
press enter to navigate to home
--
loaded via hash: ${hash}
resulted in route: ${route.path}
--
${error.toString()}`

      this.tag('Label').text = errorMessage
    }
  }

  pageTransition() {
    return 'up'
  }
}
