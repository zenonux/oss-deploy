"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
exports.default = {
    warn: function (str) {
        console.log(chalk_1.default.keyword("orange")(str));
    },
    error: function (str) {
        console.log(chalk_1.default.red(str));
    },
    info: function (str) {
        console.log(chalk_1.default.blue(str));
    },
    success: function (str) {
        console.log(chalk_1.default.green(str));
    },
};
