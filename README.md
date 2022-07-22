# oss-deploy

[![NPM version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/@urcloud/oss-deploy.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@urcloud/oss-deploy




Cli tool for deploy assets to tencent cos.

## How it works

1. Read `name`,`version`,`ossDeploy` fields from local package.json.(use `--config` to custom config)
2. Check `ossPrefix/name/mode@version` whether exists on tencent cos.(use `--force` to ignore repeated version)
3. Upload local assets from `distPath`.
4. Clear unused asests on tencent cos(keep only recent 5 versions of each mode).

## Install

```bash
npm i @urcloud/oss-deploy -D
```

## Usage

1. add `ossDeploy` field in `package.json`

```json
{
  "ossDeploy": {
    "distPath": "./dist",
    "distFilterOptions": {},
    "ossPrefix": "",
    "ossConfigPath": "./oss-config.json"
  }
}
```

2. create `oss-config.json`

```json
{
  "Region": "ap-shanghai",
  "Bucket": "test",
  "SecretId": "",
  "SecretKey": ""
}
```

3. add `scripts` in package.json

```json
{
  "scripts": {
    "deploy:test": "oss-deploy upload test --force",
    "deploy:stag": "oss-deploy upload stag",
    "deploy:prod": "oss-deploy upload prod -c ./deploy.config.json"
  }
}
```

## Changelog

v1.6.1

- Support `ossDeploy` field in `package.json`.

v1.5.6

- Add `ossPrefix` in config.
- Export `generatePrefix` function.
- `mode` add `test` type.

v1.4.1

- Support concurrent upload 3 files.

v1.3.7

- Fix ossConfigPath bug.
