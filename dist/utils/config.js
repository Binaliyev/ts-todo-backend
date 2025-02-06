"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = exports.METHODS = void 0;
const config_1 = __importDefault(require("config"));
var METHODS;
(function (METHODS) {
    METHODS["CREATE"] = "POST";
    METHODS["READ"] = "GET";
    METHODS["UPDATE"] = "PUT";
    METHODS["DELETE"] = "DELETE";
})(METHODS || (exports.METHODS = METHODS = {}));
exports.configuration = {
    port: config_1.default.get("PORT") || 5600,
    token_key: config_1.default.get("TOKEN_KEY"),
};
