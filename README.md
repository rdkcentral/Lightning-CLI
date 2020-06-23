# Lightning CLI

## Tooling for Lightning development

## Getting Started

Install the Lightning-CLI _globally_ on your system

```bash
npm install -g rdkcentral/Lightning-CLI
```

Usage:

```bash
lng <command> [options]
```

##  Commands

### Overview

Display an overview of all available commands

```bash
lng
```


### Create

Create a new Lightning App from scratch

```bash
lng create
```


### Build

Build a local development version of the Lightning App in the `build`-folder.

_Note: in older versions of the Lightning-CLI (< 1.6.0), the `lng build` command would create the built version in the `dist`-folder_

The `build` folder is purged when you rebuild your App, so it's not recommended to make changes to the files in this folder, if you intend them to be persistant.

```bash
lng build
```

_Run this command in the root folder of the Lightning App you want to build_


### Dist

Create a distributable, standalone version of your App that can either be run locally (by starting your own local server) or uploaded to a webserver.

The first time you run this command it will generate the necessary folder structure and files (in the `dist`-folder), and it will copy the settings from `settings.json` into the `index.html`.

Once created it's safe to make your own customizations to `index.html`. The `appBundle.js` and the `static`-folder are purged and regenerated everytime you run `lng dist` again.

By default the `lng dist` command generates an _ES6_ compatible App. Optionally you can generate an _ES5_ version of the App, by passing `--es5` as an option (`lng dist --es5`).

```bash
lng dist
```

_Run this command in the root folder of the Lightning App for which you want to create a distributable version_


### Serve

Start a local webserver and run a built Lightning App in a web browser (from the `build` folder)

```bash
lng serve
```

_Run this command in the root folder of the Lightning App you want to serve_


### Watch

Watch the `src` folder for changes and rebuild the Lightning App upon every change

```bash
lng watch
```

_Run this command in the root folder of the Lightning App you want to watch_


### Dev

The `lng dev` command combines different CLI commands in one, making it the most convenient command to use during _development_.

Running `lng dev` first builds your local Lightning App, then starts a local webserver and opens it in a web browser. Furthermore it will watch the `src` folder for any file changes and automatically rebuild the App upon each change.

```bash
lng dev
```

_Run this command in the root folder of the Lightning App you want to serve and watch_


### Docs

Open the _Lightning-SDK_ documentation of the App you're developing

_Note: this will open up a local webserver with the SDK documentation matching the exact SDK version the App is using_

```bash
lng docs
```

_Run this command in the root folder of the Lightning App for which you want to see the documentation_


### Upload

Upload the Lightning App to the Metrological Back Office to be published in an App Store.

_Note: you will need to create an account to upload Apps to the Metrological Back Office (http://dashboard.metrological.com/)_

```bash
lng upload
```

_Run this command in the root folder of the Lightning App you want to upload_

## Environment variables

The CLI accepts 3 types of _environment variables_:

- `NODE_ENV`
- a predefined set to customize behavior of certain CLI commands (e.g. on which `port` to open `lng serve`)
- custom variables that are injected into the App (e.g. an API key)

Environment variables can be passed via the command prompt before calling a command:

```bash
NODE_ENV=staging LNG_SERVE_PORT=3333 lng serve
```

_This will start a server on `port 3333` and the value of `process.env.NODE_ENV` (accesible from within an app) will be set to `staging`_.

It's also possible to specify multiple environment variables in a `.env` file:

```
NOD_ENV=production

LNG_SERVE_OPEN=false
LNG_SERVE_PORT=1234

APP_API_KEY=mysecretapikey
```

### NODE_ENV

`NODE_ENV` is an environment variable used by several external libraries. `NODE_ENV` is made available in your app code as `process.env.NODE_ENV`.

### Bahavior environment variables

The following environment variables are available to customize the behavior of the CLI:

- `LNG_SERVE_OPEN`<br />
Whether the CLI should open a browser window when running `lng serve` (or `lng dev`). Possible values: `true` or `false`, defaults to `true`
- `LNG_SERVE_PORT`<br />
On which port the CLI should serve when running `lng serve` (or `lng dev`). Defaults to auto incrementing depending on available ports, starting at `8080`
- `LNG_BUILD_SOURCEMAP`<br />
Instructs the CLI whether / how to generate sourcemaps. Possible values: `true`, `false` or `inline`
- `LNG_BUILD_FOLDER`<br />
In which folder the built App (using `lng build`) should be generated. Defaults to `build`
- `LNG_DIST_FOLDER`<br />
In which folder the distributable App (using `lng dist`) should be generated. Defaults to `dist`
- `LNG_AUTO_UPDATE`<br />
Whether or not the Lightning CLI should auto update. Possible values: `true` or `false`, defaults to `true`. **Note**: it's recommended to keep auto updates enabled.

### Custom App environment variables

You can specify custom environment variables that will be injected into your App bundle. This can be useful for specifying an API endpoint or API key.
App specific variables should start with `APP_` and will be made available inside the App code as `process.env.APP_MY_VAR`.

## Contributing

If you want to contribute to the Lightning-CLI, please consider the following:

- the **master** branch is the latest stable release
- the **dev** branch is used for upcoming releases
- all development should be done in dedicated *topic branches* (from latest `dev`-branch)
- please send in your PR against the `dev`-branch
