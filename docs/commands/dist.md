# Dist command

_Create a standalone, distributable version of the Lightning App_

```bash
lng dist
```

The `lng dist` command is used to build a _standalone, distributable_ version of your App that can either be run
locally (by starting your own local server) or uploaded to a webserver.

The first time you run this command it will generate the necessary folder structure and files (in the `dist-`folder),
and it will copy the settings from your `settings.json` into the `index.html`.

Once created it's safe to make your own customizations to `index.html`. The `appBundle.js` and the `static`-folder are purged
and regenerated everytime you run `lng dist`.

By default the `lng dist` command generates an _ES6_ compatible appBundle. Optionally you can generate an _ES5_ version of the App,
by passing `--es5` as an option (`lng dist --es5`).


_**Note**: Run this command in the root folder of your Lightning App_
