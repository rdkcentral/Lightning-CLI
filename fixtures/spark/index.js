const appSettings = {
  stage: {
    clearColor: '0x00000000',
    useImageWorker: true,
  },
}

const platformSettings = {
  path: './static',
}

const appData = {}

const app = window.APP(appSettings, platformSettings, appData)
