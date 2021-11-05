export type ModeType = "stag" | "prod";

export interface OssConfig {
  region: string;
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  prefix?: string;
  prefixGenerator?: (mode: ModeType, version: string) => string;
}

export interface VersionItem {
  version: string;
  release_time: string;
}

export interface ServerConfig {
  host: string;
  username: string;
  password: string;
  serverPath: string;
}

export interface Config {
  distPath: string;
  jsonPath: string;
  maxVersionCountOfMode: number;
  oss: AliOssConfig;
  stag: ServerConfig;
  prod: ServerConfig;
}
