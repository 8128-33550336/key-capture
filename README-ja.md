<samp>
<div align="center">

# key-capture

</div>

[![publish](https://github.com/8128-33550336/key-capture/actions/workflows/publish.yml/badge.svg?event=push)](https://github.com/8128-33550336/key-capture/actions/workflows/publish.yml)

[Package](https://github.com/8128-33550336/key-capture/pkgs/npm/key-capture)

言語: [English](./README.md)

# これはなに?

これは ECHO などを止めます。CLIアプリを作るのに役立ちます。184通りのキーの組み合わせに対応しています。

# インストール

~/.npmrc

```
@8128-33550336:registry=https://npm.pkg.github.com

//npm.pkg.github.com/:_authToken=あなたのトークン
```

```
$ npm i @8128-33550336/key-capture
```

# 例

## 使い方

```ts
const capture = createCapture();
capture.start();

capture.keyEventEmitter.on("Control.C", () => {
  process.exit(0);
});
```

# 最後に

ぜひ使ってください

IssueやPullRequestを歓迎します。

</samp>
