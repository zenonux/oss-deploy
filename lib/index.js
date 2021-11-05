"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = __importDefault(require("./log"));
var versionManager_1 = __importDefault(require("./versionManager"));
var oss_1 = __importDefault(require("./oss"));
var server_1 = __importDefault(require("./server"));
var inquirer_1 = __importDefault(require("inquirer"));
var joi_1 = __importDefault(require("joi"));
var Aod = /** @class */ (function () {
    function Aod(opts) {
        this.config = this.validateConfig(opts);
        this.oss = new oss_1.default(this.config.oss, this.config.distPath);
        this.server = new server_1.default(this.config.distPath);
        this.versionManager = new versionManager_1.default(this.config.jsonPath);
    }
    Aod.prototype.uploadAssetsAndHtml = function (mode, version) {
        return __awaiter(this, void 0, void 0, function () {
            var serverConfig, prefix, isHasVersion, answer, dirList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        serverConfig = this.config[mode];
                        prefix = this.config.oss.prefix
                            ? this.config.oss.prefix(mode, version)
                            : "";
                        return [4 /*yield*/, this.versionManager.checkHasVersion(prefix)];
                    case 1:
                        isHasVersion = _a.sent();
                        if (isHasVersion) {
                            log_1.default.error(prefix + " has been uploaded already,please check your version!");
                            return [2 /*return*/];
                        }
                        if (!(mode == "prod")) return [3 /*break*/, 3];
                        return [4 /*yield*/, inquirer_1.default.prompt([
                                {
                                    type: "confirm",
                                    name: "release",
                                    message: "confirm releasing " + prefix + "?",
                                    default: false,
                                },
                            ])];
                    case 2:
                        answer = _a.sent();
                        if (!answer.release) {
                            log_1.default.warn("releasing " + prefix + " has been cancelled.");
                            return [2 /*return*/];
                        }
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.oss.uploadAssets(prefix)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.server.uploadHtml(serverConfig)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.versionManager.addVersion(prefix)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.versionManager.getNeedClearVersions(mode, this.config.maxVersionCountOfMode)];
                    case 7:
                        dirList = _a.sent();
                        if (dirList.length >= this.config.maxVersionCountOfMode) {
                            log_1.default.warn("Static assets in " + mode + " environment already has " + dirList.length + " versions,please clear unused versions regularly.");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Aod.prototype.clearAssets = function (mode) {
        return __awaiter(this, void 0, void 0, function () {
            var prefixList, answer, isSuccess;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.versionManager.getNeedClearVersions(mode, this.config.maxVersionCountOfMode)];
                    case 1:
                        prefixList = _a.sent();
                        if (prefixList.length <= 0) {
                            log_1.default.warn("No assets need to clear.");
                            return [2 /*return*/];
                        }
                        if (!(mode == "prod")) return [3 /*break*/, 3];
                        return [4 /*yield*/, inquirer_1.default.prompt([
                                {
                                    type: "confirm",
                                    name: "release",
                                    message: "confirm clearing unused assets?",
                                    default: false,
                                },
                            ])];
                    case 2:
                        answer = _a.sent();
                        if (!answer.release) {
                            log_1.default.warn("clearing assets has been cancelled.");
                            return [2 /*return*/];
                        }
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.oss.clearAllUnNeedAssests(prefixList)];
                    case 4:
                        isSuccess = _a.sent();
                        if (!isSuccess) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.versionManager.deleteVersions(prefixList)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Aod.prototype.validateConfig = function (opts) {
        var schema = joi_1.default.object({
            distPath: joi_1.default.string().default("./dist"),
            jsonPath: joi_1.default.string().default("./deploy.version.json"),
            maxVersionCountOfMode: joi_1.default.number().default(5),
            oss: joi_1.default.object({
                accessKeyId: joi_1.default.string().required(),
                accessKeySecret: joi_1.default.string().required(),
                region: joi_1.default.string().required(),
                bucket: joi_1.default.string().required(),
                prefix: joi_1.default.function().arity(2).required(),
            })
                .unknown(true)
                .required(),
            stag: joi_1.default.object({
                host: joi_1.default.string().required(),
                username: joi_1.default.string().required(),
                password: joi_1.default.string().required(),
                serverPath: joi_1.default.string().required(),
            }).unknown(true),
            prod: joi_1.default.object({
                host: joi_1.default.string().required(),
                username: joi_1.default.string().required(),
                password: joi_1.default.string().required(),
                serverPath: joi_1.default.string().required(),
            })
                .unknown(true)
                .required(),
        }).unknown(true);
        var validateRes = schema.validate(opts);
        if (validateRes.error) {
            console.error(validateRes.error);
            process.exit();
        }
        return validateRes.value;
    };
    return Aod;
}());
exports.default = Aod;
