# oss-deploy

Cli tool for deploy assets to tencent cos.

## How it works

1. Read `name`,`version` fields from local package.json.
2. Check `ossPrefix/name/mode@version` whether exists on tencent cos.
3. Upload local assets from `distPath`.
4. Clear unused asests on tencent cos(keep only recent 5 versions of each mode).

## Install

```bash
npm i @urcloud/oss-deploy -D
```

## Usage

1. create `deploy.config.json` at the root of the project

```json
{
  "distPath": "./dist",
  "distFilterOptions": {},
  "ossPrefix":"",
  "ossConfigPath": "./oss-config.json",
  "packageJsonPath": "./package.json"
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
    "deploy:stag": "oss-deploy upload stag --force",
    "deploy:prod": "oss-deploy upload prod"
  }
}
```

## Changelog

v1.5.6
- Add `ossPrefix` in config.
- Export `generatePrefix` function.
- `mode` add `test` type.
  
v1.4.1
- Support concurrent upload 3 files.
  
v1.3.7
- Fix ossConfigPath bug.