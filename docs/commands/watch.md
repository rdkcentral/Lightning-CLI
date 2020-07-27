# Watch command

_Watch for file changes and automatically rebuild the App_

```bash
lng watch
```

Whenever you make a change to an App's source code, you have to _rebuild_ the App (using `lng build`).
This can become a cumbersome process, not to mention easy to forget.

The `lng watch` command automates this for you, by initiating a _watcher_ that keeps track of file changes
and triggers a rebuild upon every change.

The command watches the `src` folder, the `static` folder, `settings.json` and `metadata.json`. The Lightning-CLI intelligently
generates a new build depending on what has changed.

If you make changes outside any of these files and folders, you will have to manually rebuild your App.

Note that the `lng watch` command _doesn't_ automatically _hot reload_ the App. You will still have to refresh the browser to see the latest changes.

_**Note**: Run this command in the root folder of your Lightning App_
