"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var jsonfile_1 = __importDefault(require("jsonfile"));
var ora_1 = __importDefault(require("ora"));
var fs = __importStar(require("fs"));
var VersionManager = /** @class */ (function () {
    function VersionManager(jsonPath) {
        this.jsonPath = jsonPath;
    }
    VersionManager.prototype.writeJsonFile = function (data, touchFile) {
        if (touchFile === void 0) { touchFile = false; }
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!!touchFile) return [3 /*break*/, 2];
                        return [4 /*yield*/, fs.promises.chmod(this.jsonPath, 438)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, jsonfile_1.default.writeFile(this.jsonPath, data, {
                            mode: 438,
                            spaces: 2,
                            EOL: "\r\n",
                        })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, fs.promises.chmod(this.jsonPath, 292)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        throw new Error(e_1);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    VersionManager.prototype.getJsonFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var isFileExisted, list, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fs.promises
                            .access(this.jsonPath, fs.constants.F_OK | fs.constants.R_OK)
                            .then(function () { return true; })
                            .catch(function () { return false; })];
                    case 1:
                        isFileExisted = _a.sent();
                        if (!!isFileExisted) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.writeJsonFile([], true)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, []];
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, jsonfile_1.default.readFile(this.jsonPath)];
                    case 4:
                        list = _a.sent();
                        return [2 /*return*/, list];
                    case 5:
                        e_2 = _a.sent();
                        throw new Error(e_2);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    VersionManager.prototype.checkHasVersion = function (prefix) {
        return __awaiter(this, void 0, void 0, function () {
            var list, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getJsonFile()];
                    case 1:
                        list = _a.sent();
                        return [2 /*return*/, list.some(function (val) { return val.version === prefix; })];
                    case 2:
                        e_3 = _a.sent();
                        throw new Error(e_3);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VersionManager.prototype.addVersion = function (prefix) {
        return __awaiter(this, void 0, void 0, function () {
            var isHasVersion, spinner, list, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkHasVersion(prefix)];
                    case 1:
                        isHasVersion = _a.sent();
                        if (isHasVersion) {
                            throw new Error(prefix + " has been uploaded already,please check your version!");
                        }
                        spinner = (0, ora_1.default)("Start writing json file...").start();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, jsonfile_1.default.readFile(this.jsonPath)];
                    case 3:
                        list = _a.sent();
                        list.push({
                            version: prefix,
                            release_time: new Date().toLocaleString(),
                        });
                        return [4 /*yield*/, this.writeJsonFile(list)];
                    case 4:
                        _a.sent();
                        spinner.succeed("Write version in json file successfully.");
                        return [2 /*return*/, prefix];
                    case 5:
                        e_4 = _a.sent();
                        spinner.fail();
                        throw new Error(e_4);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    VersionManager.prototype.getNeedClearVersions = function (mode, maxVersionCountOfMode) {
        return __awaiter(this, void 0, void 0, function () {
            var list, modeList, clearModeList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, jsonfile_1.default.readFile(this.jsonPath)];
                    case 1:
                        list = _a.sent();
                        modeList = list.filter(function (val) { return val.version.indexOf(mode) !== -1; });
                        clearModeList = modeList.length > maxVersionCountOfMode
                            ? modeList.slice(0, modeList.length - maxVersionCountOfMode)
                            : [];
                        return [2 /*return*/, clearModeList];
                }
            });
        });
    };
    VersionManager.prototype.deleteVersions = function (dirList) {
        return __awaiter(this, void 0, void 0, function () {
            var list, targetList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(dirList.length <= 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getJsonFile()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, jsonfile_1.default.readFile(this.jsonPath)];
                    case 3:
                        list = _a.sent();
                        targetList = list.filter(function (item) { return !dirList.some(function (val) { return val.version == item.version; }); });
                        return [4 /*yield*/, this.writeJsonFile(targetList)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.getJsonFile()];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return VersionManager;
}());
exports.default = VersionManager;
