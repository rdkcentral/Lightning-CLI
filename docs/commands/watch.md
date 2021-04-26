# Watch

*Watch for file changes and automatically rebuild the App*

```bash
lng watch
```

> Run this command from the root folder of your Lightning App.

If you make a change to the source code of your App, you have to *rebuild* the App (using `lng build`).
This can become a cumbersome process and is easily forgotten.

The `lng watch` command performs an automatic build, by initiating a *watcher* that keeps track of any file changes
and that triggers a rebuild for every change.

The command watches the **src** and **static** folders and the **settings.json** and **metadata.json** files.

The Lightning CLI intelligently
generates a new build, depending on what has changed.

If you make changes *outside* the files and folders mentioned above, you have to rebuild your App manually.

> The `lng watch` command does *not* automatically *hot reload* your App. You still have to refresh the browser to see the latest changes.
