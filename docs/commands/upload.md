# Upload

*Upload the Lightning App to the Metrological Dashboard, so that it can be published to an operator's App Store*

```bash
lng upload
```

> Run this command from the root folder of your Lightning App.

When you have finished developing your App, you can upload your App to the Metrological Dashboard,
so it can be published to an operator s App Store.

> You need to create an account to be able to upload Apps to the [Metrological Dashboard](http://dashboard.metrological.com/).

The `lng upload` command takes care of the *entire* uploading process. It prompts you for a valid *API key* to authenticate your account. It will then build and bundle up your App and upload it to the Metrological Dashboard.


> WARNING!<br /><br />
> The `lng upload` command has been deprecated and has moved to a separate package.<br />
> Please see [https://www.github.com/Metrological/metrological-cli](https://www.github.com/Metrological/metrological-cli) for more info.<br />
> The upload command will be completely removed from the Lightnng-CLI in the Jan 2023 release<br />
