export type ModeType = "test" | "stag" | "prod";

export interface BucketManager {
  uploadLocalFile(name: string, filePath: string): Promise<any>;
  uploadLocalDirectory(
    name: string,
    dirPath: string,
    filterOptions: Record<string, any>
  ): Promise<any>;
  listRemoteFiles(prefix: string): Promise<string[]>;
  listRemoteDirectory(prefix: string): Promise<string[]>;
  clearRemoteDirectory(prefix: string): Promise<void>;
}

export type OssOptions = {
  Region: string;
  SecretId: string;
  SecretKey: string;
  Bucket: string;
};

export type Options = OssOptions & {
  distPath: string;
  distFilterOptions: Record<string, any>;
};
