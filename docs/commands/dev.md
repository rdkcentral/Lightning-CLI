# Dev command

_Build a local Lightning App, start a local webserver, run a built Lightning App in a web browser and watch for changes_

```bash
lng dev
```

The `lng dev` command combines three Lightning-CLI commands into one, making it the most convenient command to use during development.

Running `lng dev`:
- first _builds_ your Lightning App (i.e. `lng build`)
- then starts a local _webserver_ and _opens_ it in a web browser (i.e. `lng serve`)
- finally it will also initiate a _watcher_ for any file changes and automatically _rebuild_ the App upon each change (i.e. `lng watch`)

_**Note**: Run this command in the root folder of your Lightning App_

