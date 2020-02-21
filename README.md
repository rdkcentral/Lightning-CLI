# Lightning CLI

## Tooling for Lightning development

## Getting Started

Install the Lightning-CLI _globally_ on your system

```bash
npm install -g WebPlatformForEmbedded/Lightning-CLI
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

Build a standalone Lightning App

```bash
lng build
```

_Run this command in the root of the Lightning App you want to build_


### Serve

Serve a built Lightning App in a webbrowser

```bash
lng serve
```

_Run this command in the root of the Lightning App you want to serve_


### Watch

Watch the `src` folder for changes and rebuild the Lightning App upon every change

```bash
lng watch
```

_Run this command in the root of the Lightning App you want to watch_


### Dev

Spins up a local server to serve a Lightning App and watches for changes

```bash
lng dev
```

_Run this command in the root of the Lightning App you want to serve and watch_


### Docs

Open the Lightning SDK documentation of the App you're developing

```bash
lng docs
```

_Run this command in the root of the Lightning App for which you want to see the documentation_


### Release

Create a release package of a Lightning App

```bash
lng release
```

_Run this command in the root of the Lightning App you want to release_


### Upload

Upload a release package of a Lightning App to the Metrological Back Office

```bash
lng upload
```

_Run this command in the root of the Lightning App you want to upload_

## Contributing

If you want to contribute to the Lightning-CLI, please consider the following:

- the **master** branch is the latest stable release
- the **dev** branch is used for upcoming releases
- all development should be done in dedicated *topic branches* (from latest `dev`-branch)
- please send in your PR against the `dev`-branch
