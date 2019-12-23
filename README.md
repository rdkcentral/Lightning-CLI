# Lightning CLI

## Tooling for Lightning development

_Work in Progress_

## Getting Started

Install the Lightning-CLI _globally_ on your system

```bash
npm install -g WebPlatformForEmbedded/Lightning-CLI
```

Usage:

```bash
lightning-cli <command> [options]
```

##  Commands

### Overview

Display an overview of all available commands

```bash
lightning-cli
```

### Create

Create a new Lightning App from scratch

```bash
lightning-cli create
```

### Build

Build a standalone Lightning App

```bash
lightning-cli build
```

_Run this command in the root of the Lightning App you want to build_


### Serve

Serve a built Lightning App in a webbrowser

```bash
lightning-cli serve
```

_Run this command in the root of the Lightning App you want to serve_


### Watch

Watch the `src` folder for changes and rebuild the Lightning App upon every change

```bash
lightning-cli watch
```

_Run this command in the root of the Lightning App you want to watch_


### Dev

Spins up a local server to serve a Lightning App and watches for changes

```bash
lightning-cli dev
```

_Run this command in the root of the Lightning App you want to serve and watch_


### Docs

Open the SDK documentation of the App you're developing

```bash
lightning-cli dev
```

_Run this command in the root of the Lightning App for which you want to see the documentation_


### Release

**Todo**

Create a release package of a Lightning App

```bash
lightning-cli release
```

_Run this command in the root of the Lightning App you want to release_


### Upload

**Todo**

Upload a release package of a Lightning App to the Metrological Back Office

```bash
lightning-cli upload
```

_Run this command in the root of the Lightning App you want to upload_
