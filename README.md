# oss-deploy

it will upload index.html to Server and upload assets(css,js,img) to aliyun oss with version manager using a local json file.

## Install

```bash
npm i @urcloud/oss-deploy -D
```

## Usage

./.deploy.config.js

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

package.json

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
