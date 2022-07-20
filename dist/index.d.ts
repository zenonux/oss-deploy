declare type ModeType = "stag" | "prod";
declare type OssOptions = {
    Region: string;
    SecretId: string;
    SecretKey: string;
    Bucket: string;
};
declare type Options = OssOptions & {
    distPath: string;
    projectPrefix: string;
    distFilterOptions: Record<string, any>;
    packageJsonPath: string;
    ossConfigPath: string;
};

declare const generatePrefix: (name: string, mode: ModeType, version: string) => string;
declare class OssDeploy {
    private _oss;
    private _distPath;
    private _distFilterOptions;
    private _versions;
    constructor(options: Options);
    uploadAssets(projectPrefix: string, name: string, mode: ModeType, version: string, isForce: boolean): Promise<void>;
    private _clearAssets;
    private _getNeedClearVersionList;
    private _buildPrefix;
    private _validateOptions;
}

export { OssDeploy as default, generatePrefix };
