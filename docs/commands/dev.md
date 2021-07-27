# Dev

*Build a local Lightning App, start a local webserver, run a built Lightning App in a web browser and watch for changes*

```bash
lng dev
```

> Run this command from the root folder of your Lightning App.

The `lng dev` command combines *three* Lightning CLI commands into *one*, making it the *most convenient* command to use during development.

The command `lng dev` performs the following actions subsequently:

1. Build your Lightning App (see `[lng build](build.md)`)
2. Start a local webserver and open it in a web browser (see `[lng serve](serve.md)`)
3. Initiate a *watcher* for any file changes and automatically *rebuild* the App upon each change (see `[lng watch](watch.md)`)
