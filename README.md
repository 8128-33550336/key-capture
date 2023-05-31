<samp>
<div align="center">

# key-capture

</div>

[![publish](https://github.com/8128-33550336/key-capture/actions/workflows/publish.yml/badge.svg?event=push)](https://github.com/8128-33550336/key-capture/actions/workflows/publish.yml)

[Package](https://github.com/8128-33550336/key-capture/pkgs/npm/key-capture)

Language: [Japanese](./README-ja.md)

# About

This turns off ECHO etc. This is useful for building CLI apps. It supports
184key combinations.

# Install

~/.npmrc

```
@8128-33550336:registry=https://npm.pkg.github.com

//npm.pkg.github.com/:_authToken=YourTokenHere
```

```
$ npm i @8128-33550336/key-capture
```

# Example

## Usage

```ts
const capture = createCapture();
capture.start();

capture.keyEventEmitter.on("Control.C", () => {
  process.exit(0);
});
```

# We welcome issues and pull requests.

</samp>
