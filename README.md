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
    "sync": "oss-deploy sync ./assets",
    "deploy:stag": "oss-deploy upload stag -c ./.deploy.config.js",
    "clear:stag": "oss-deploy clear stag -c ./.deploy.config.js",
    "deploy:prod": "oss-deploy upload prod -c ./.deploy.config.js",
    "clear:prod": "oss-deploy clear prod -c ./.deploy.config.js"
  }
}
```
