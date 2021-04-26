# Dist

*Create a standalone, distributable version of the Lightning App*

```bash
lng dist
```

> Run this command from the root folder of your Lightning App.

The `lng dist` command is used to build a *standalone, distributable* version of your App that can either be run
locally (by starting your own local server) or that can be uploaded to a webserver.

The first time you run this command, it generates the required folder structure and files (in the **dist** folder),
and copies the settings from your **settings.json** file into the **index.html** file.

After that, you can make your own customizations to **index.html**.

Each time that you run `lng dist`, the **appBundle.js** and the **static** folders are purged
and regenerated.

By default, the `lng dist` command generates an *es6*-compatible appBundle. Optionally, you can generate an *es5* version of the App,
by passing `--es5` as an option as shown below:

```bash
lng dist --es5
```
