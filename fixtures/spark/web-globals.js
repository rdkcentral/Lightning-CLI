const URL = require('url').URL
// eslint-disable-next-line no-unused-vars
const URLSearchParams = require('url').URLSearchParams

const location = new Proxy(
  (() => {
    let _url = new URL(global.__dirname)
    _url.search = new URLSearchParams(global.sparkQueryParams)
    if (global.sparkHash) _url.hash = global.sparkHash
    return _url
  })(),
  {
    get: (obj, prop) => obj[prop],
    set: (obj, prop, value) => {
      obj[prop] = value
      if (prop === 'hash') window.dispatchEvent(new Event('hashchange'))
      return true
    },
  }
)

// eslint-disable-next-line no-unused-vars
class Event extends String {}

class EventTarget extends require('events') {
  addEventListener(type, listener) {
    this.addListener(type, listener)
  }

  removeEventListener(type, listener) {
    this.removeListener(type, listener)
  }

  dispatchEvent(event) {
    this.emit(event)
  }
}

const relative2absolute = url => {
  if (/^\/\//.test(url)) return window.location.protocol + url
  if (/^\//.test(url)) return window.location.origin + url
  if (!/^(?:https?:)/i.test(url)) return require('url').resolve(window.location.toString(), url)
  return url
}

const globalsHandler = {
  get: (obj, prop) => {
    return prop in obj
      ? obj[prop]
      : prop in global
      ? global[prop]
      : eval(`typeof ${prop} !== 'undefined' ? ${prop} : undefined`)
  },
  set: (obj, prop, value) => {
    if (eval(`typeof ${prop} !== 'undefined'`)) eval(`${prop} = value`)
    else obj[prop] = value
    return true
  },
}

const window = new Proxy(
  new (class SparkWindow extends EventTarget {
    constructor() {
      super()
      this.enableSparkGL1080 =
        global.sparkscene.capabilities &&
        global.sparkscene.capabilities.sparkgl &&
        global.sparkscene.capabilities.sparkgl.supports1080 &&
        location.searchParams.has('enableSparkGL1080')
    }

    get innerWidth() {
      return this.enableSparkGL1080 ? 1920 : global.sparkscene.w
    }

    get innerHeight() {
      return this.enableSparkGL1080 ? 1080 : global.sparkscene.h
    }

    get location() {
      return location
    }

    get localStorage() {
      return localStorage
    }

    get clearTimeout() {
      return clearTimeout
    }

    get setTimeout() {
      return setTimeout
    }
  })(),
  globalsHandler
)

// eslint-disable-next-line no-unused-vars
const document = new Proxy(
  new (class SparkDocument extends EventTarget {
    constructor() {
      super()
      this.head = { appendChild: () => {} }
      this.body = { appendChild: () => {} }
      this.fonts = { add: () => {} }
    }

    get location() {
      return location
    }

    createElement(tagName) {
      if (tagName === 'style') {
        return { sheet: { insertRule: () => {} }, appendChild: () => {} }
      } else if (tagName === 'script') {
        return new SparkScript()
      } else if (tagName === 'link') {
        return {}
      }
    }

    createTextNode() {
      return {}
    }

    getElementById() {
      return null
    }

    querySelector(selectors) {
      let found = selectors.match(/script\[src\*?=["'](.*)["']]/i)
      if (found) {
        let src = found[1]
        if (global.bootstrap) {
          if (global.bootstrap.applicationURL.indexOf(src) !== -1) {
            return { getAttribute: attributeName => global.bootstrap[attributeName] }
          }
        }
      }
      console.warn(`document.querySelector(${selectors}) isn't supported`)
      return null
    }
  })(),
  globalsHandler
)

// eslint-disable-next-line no-unused-vars
class XMLHttpRequest extends EventTarget {
  constructor() {
    super()
    this.readyState = 0
  }

  open(method, URL) {
    this._method = method
    this._URL = relative2absolute(URL)
    this.readyState = 1
  }

  send(body) {
    let self = this
    fetch(this._URL, { method: this._method, body: body }).then(r => {
      self.status = r.status
      self.readyState = 4
      self.responseText = r._bodyText.toString()
      if (self.onreadystatechange) self.onreadystatechange()
    })
  }
}

// eslint-disable-next-line no-unused-vars
class FontFace {
  constructor(family, source, descriptors) {
    let m = source.match(/\((.*)\)/)
    this._url = m ? m[1] : m
  }

  load() {
    let fontResource = global.sparkscene.create({ t: 'fontResource', url: this._url })
    return fontResource.ready
  }
}

class SparkScript {
  set onload(callback) {
    this._onload = callback
  }

  set load(b) {
    this._load = b
  }

  set src(url) {
    url = relative2absolute(url)

    if (this._load) {
      let self = this
      fetch(url).then(r => {
        if (r.status >= 200 && r.status <= 299) {
          global.vm.runInThisContext(r._bodyText.toString())
          self._onloaded()
        } else {
          console.log(`HTTP ${r.status} for '${url}'`)
        }
      })
    } else {
      this._onloaded()
    }
  }

  _onloaded() {
    let self = this
    setImmediate(() => {
      if (self._onload) self._onload()
    })
  }
}
