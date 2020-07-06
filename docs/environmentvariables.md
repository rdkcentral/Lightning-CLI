# Environment variables

The Lightning-CLI accepts 3 types of _environment variables_:

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

### Behavior environment variables

The following environment variables are available to customize the behavior of the Lightning-CLI:

#### `LNG_SERVE_OPEN`
Whether or not the Lightning-CLI should open a browser window when running `lng serve` (or `lng dev`). Possible values: `true` or `false`, defaults to `true`

#### `LNG_SERVE_PORT`

On which port the Lightning-CLI should serve when running `lng serve` (or `lng dev`). Defaults to auto incrementing depending on available ports, starting at `8080`

#### `LNG_BUILD_SOURCEMAP`

Instructs the Lightning-CLI whether and how to generate sourcemaps. Possible values: `true`, `false` or `inline`. Defaults to `true`

`true` will generate the sourcemaps in a separate file (`appBundle.js.map`). `inline` will append the sourcemaps to the `appBundle.js` itself as a data URI.

#### `LNG_BUILD_FOLDER`

In which folder the built App (using `lng build`) should be generated. Defaults to `build`

#### `LNG_DIST_FOLDER`

In which folder the standalone, distributable App (using `lng dist`) should be generated. Defaults to `dist`

#### `LNG_AUTO_UPDATE`

Whether or not the Lightning CLI should auto update. Possible values: `true` or `false`, defaults to `true`. **Note**: it's recommended to keep auto updates enabled.

### Custom App environment variables

You can specify custom environment variables that will be _injected_ into your App bundle. This can be useful for specifying an API endpoint or API key.
App specific variables should always start with `APP_` and will then be made available inside the App code as `process.env.APP_MY_VAR`.
