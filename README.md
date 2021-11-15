# oss-deploy

cli tool for deploy assets to oss.

> It uploads index.html to remote server and uploads assets(css,js,img) to aliyun oss,using a local json file to manage version.

## Install

```bash
npm i @urcloud/oss-deploy -D
```

## Usage

1. create `.deploy.config.js` on the root of the project

```js
module.exports = {
  distPath: './dist',
  jsonPath: './deploy.version.json',
  maxVersionCountOfMode: 5,
  oss: {
    accessKeyId: '',
    accessKeySecret: '',
    region: 'oss-cn-shanghai',
    bucket: 'test',
    prefix: (mode, version) => {
      return mode + '@' + version
    },
  },
  stag: {
    host: '',
    username: '',
    password: '',
    serverPath: '',
  },
  prod: {
    host: '',
    username: '',
    password: '',
    serverPath: '',
  },
}
```

2. add `scripts` in package.json

```json
{
  "scripts": {
    "deploy:stag": "oss-deploy upload stag",
    "clear:stag": "oss-deploy clear stag",
    "deploy:prod": "oss-deploy upload prod",
    "clear:prod": "oss-deploy clear prod"
  }
}
```
