# oss-deploy

cli tool for deploy assets to tencent cos.

## How it works

1. Read `name`,`version` fields from local package.json.
2. Check `name`/`mode`@`version` if exists on tencent cos.
3. Upload local assets from `distPath`.
4. Clear unused asests on tencent cos(keep only recent 5 version of each mode).

## Install

```bash
npm i @urcloud/oss-deploy -D
```

## Usage

1. create `.deploy.config.js` on the root of the project

```js
module.exports = {
  distPath: './dist',
  SecretId: '',
  SecretKey: '',
  Region: 'ap-shanghai',
  Bucket: 'test',
}
```

2. add `scripts` in package.json

```json
{
  "scripts": {
    "deploy:stag": "oss-deploy upload stag",
    "deploy:prod": "oss-deploy upload prod"
  }
}
```
