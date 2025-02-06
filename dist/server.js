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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_http_1 = __importDefault(require("node:http"));
const errors_1 = require("./utils/errors");
const auth_controller_1 = __importDefault(require("./controllers/auth.controller"));
const config_1 = require("./utils/config");
const jwt_1 = __importDefault(require("./jwt/jwt"));
const todo_controller_1 = __importDefault(require("./controllers/todo.controller"));
const server = node_http_1.default.createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const req_url = req.url.trim().toLowerCase();
    const req_method = req.method.trim().toUpperCase();
    res.setHeader("Content-type", "application/json");
    if (req_url.startsWith('/api')) {
        if (req_url.startsWith("/api/auth")) {
            if (req_url.startsWith("/api/auth/register") && req_method == config_1.METHODS.CREATE)
                auth_controller_1.default.REGISTER(req, res);
            if (req_url.startsWith("/api/auth/login") && req_method == config_1.METHODS.CREATE)
                auth_controller_1.default.LOGIN(req, res);
        }
        else if (yield jwt_1.default.check_token(req, res)) {
            if (req_url.startsWith("/api/todos") && req_method == config_1.METHODS.CREATE)
                todo_controller_1.default.CREATE_TODO(req, res);
            if (req_url.startsWith("/api/todos/") && req_method == config_1.METHODS.UPDATE)
                todo_controller_1.default.UPDATE_TODO(req, res);
            if (req_url.startsWith("/api/todos/") && req_method == config_1.METHODS.DELETE)
                yield todo_controller_1.default.DELETE_TODO(req, res);
            if (req_method == config_1.METHODS.READ && (req_url.startsWith("/api/todos/all") || req_url.startsWith("/api/todos/")))
                yield todo_controller_1.default.READ_TODO(req, res);
            if (req_url.startsWith("/api/todos?") && req_method == config_1.METHODS.READ)
                yield todo_controller_1.default.READ_TODO(req, res);
        }
    }
    else
        (0, errors_1.globalError)(res, { message: "Invalid url", status: 404 });
}));
server.listen(config_1.configuration.port, () => console.log(`Server runing in ${config_1.configuration.port}-port`));
