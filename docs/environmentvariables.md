# Environment Variables

The Lightning CLI accepts three types of *environment variables*, which are:

* `NODE_ENV`
* A predefined set of environment variables that *customize the behavior* of CLI commands (for example, by changing the port on which to open `lng serve`)
* Custom, app-specific variables to be injected into your App (for example, an API key)

You can pass environment variables via the command prompt before calling a command, or you can specify them in the **.env** file.

Example of passing environment variables via the *command prompt*:

```bash
NODE_ENV=staging LNG_SERVE_PORT=3333 lng serve
```

This starts a server on *port 3333* and sets the value of `process.env.NODE_ENV` (accessible from inside you App) to 'staging'.

Example of specifying environment variables in the **.env** file:

```
NODE_ENV=production

LNG_SERVE_OPEN=false
LNG_SERVE_PORT=1234

APP_API_KEY=mysecretapikey
```

## Types of Environment Variables

### NODE_ENV

The environment variable `NODE_ENV` is used by several external libraries. You can also reference to this environment variable in your App code as `process.env.NODE_ENV`.

### Behavior Environment Variables

You can use the following environment variables to customize the behavior of the Lightning CLI:

| Name | Default | Description |
|---|---|---|
| `LNG_SERVE_OPEN` | true | Indicates whether or not the Lightning CLI opens a browser window when running `lng serve` or `lng dev`. Possible values: `true`, `false`. |
| `LNG_SERVE_PORT` | auto-incrementing, start at '8080' | Specifies on which port the Lightning CLI must serve when running `lng serve` or `lng dev`. Auto-incrementing and starting port (see Default) depend on available ports. |
| `LNG_SERVE_PROXY` | (N.A.) | Proxies all requests that cannot be resolved locally to the given URL. |
| `LNG_BUILD_SOURCEMAP` | true | Instructs the Lightning CLI whether or not and if so, *how* to generate sourcemaps. Possible values: `true`, `false`, `inline`. The value `true` generates the sourcemaps in a separate file (**appBundle.js.map**). The value `inline` appends the sourcemaps to the **appBundle.js** itself as a data URI. |
| `LNG_BUILD_FOLDER` | build | Specifies the folder in which the built App (using `lng build`) will be generated. |
| `LNG_DIST_FOLDER` | dist | Specifies the folder in which the standalone, distributable App (using `lng dist`) will be generated. |
| `LNG_AUTO_UPDATE` | true | Indicates whether or not the Lightning CLI should automatically update ('auto update'). Possible values: `true`, `false`. **Note**: It is recommended to keep auto updates enabled. |
| `LNG_BUILD_EXIT_ON_FAIL` | false | Specifies whether or not the build process should hard exit when a build error occurs. Note that the build process is triggered in several commands (`lng build`, `lng dev`, `lng watch` and `lng dist`) |
| `LNG_BUILD_FAIL_ON_WARNINGS` | false | Specifies whether or not to show the warning to the user when a build warning occurs. Note that the build process is triggered in several commands (`lng build`, `lng dev`, `lng watch` and `lng dist`) |
| `LNG_BUNDLER` | rollup | Specify which bundler the CLI should use to bundle the app.  Possible values: `rollup`, `esbuild`. |
| `LNG_BROWSER_BUILD` | false | Specify whether or not  browser build is to be generated.  Possible values: `true`, `false`. |


#### `LNG_SETTINGS_ENV`
Specifies which environment to be used. User need to have `settings.{env}.json` file in the Project home folder with different settings. This will build/dist the application with `settings.{env}.json`.
If `settings.{env}.json` file is not found in the Project home folder, then default settings file(`settings.json`) is considered to build/dist the application.

For example `LNG_SETTINGS_ENV=dev` picks up the `settings.dev.json` file(in the Project home folder) to build/dist the application

Defaults to `settings.json`
You can specify custom, app-specific environment variables to be  *injected* into your App bundle. This can be useful for specifying an API endpoint or API key, for example.

App-specific variables must always start with `APP_` and are referenced inside the App code as `process.env.APP_MY_VAR`.
