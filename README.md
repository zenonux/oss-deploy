# oss-deploy

Cli tool for deploy assets to tencent cos.

## How it works

1. Read `name`,`version` fields from local package.json.
2. Check `${ossPrefix}name`/`mode`@`version` whether exists on tencent cos.
3. Upload local assets from `distPath`.
4. Clear unused asests on tencent cos(keep only recent 5 versions of each mode).

## Install

```bash
npm i @urcloud/oss-deploy -D
```

## Usage

1. create `deploy.config.json` on the root of the project

```json
{
  "distPath": "./dist",
  "ossPrefix":"",
  "distFilterOptions": {},
  "packageJsonPath": "./package.json",
  "ossConfigPath": "./oss-config.json"
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

v1.5.4
- 配置文件支持`ossPrefix`前缀
- export`generatePrefix`函数

v1.4.1
- 默认并发3个文件上传
  
v1.3.7
- fix ossConfigPath bug