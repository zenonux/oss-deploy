## 安装

```bash
npm i @urcloud/oss-deploy -D
```

## 场景一：部署单页应用（附带版本管理）

> 将上传 dist 目录下 index.html 至服务器，dist 目录下所有文件至 oss，并将版本发布记录写入本地 json 文件

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
    prefixGenerator: (mode, version) => {
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
    "deploy:stag": "oss-deploy upload stag -c ./.deploy.config.js",
    "clear:stag": "oss-deploy clear stag -c ./.deploy.config.js",
    "deploy:prod": "oss-deploy upload prod -c ./.deploy.config.js",
    "clear:prod": "oss-deploy clear prod -c ./.deploy.config.js"
  }
}
```

## 场景二：同步微信小程序静态资源至 OSS（无版本管理）

> 将同步本地 assets 的所有文件至 OSS

.deploy.config.js

```js
module.exports = {
  oss: {
    accessKeyId: '',
    accessKeySecret: '',
    region: 'oss-cn-shanghai',
    bucket: 'test',
    prefix: '',
  },
}
```

package.json

```json
{
  "scripts": {
    "sync:assets": "oss-deploy sync ./assets -c ./.deploy.config.js"
  }
}
```
