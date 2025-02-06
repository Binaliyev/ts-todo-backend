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
const controllers_dto_1 = require("../dto/controllers.dto");
const controlFileEvent_1 = __importDefault(require("../models/controlFileEvent"));
const errors_1 = require("../utils/errors");
const validation_1 = require("../utils/validation");
const jwt_1 = __importDefault(require("../jwt/jwt"));
const config_1 = require("../utils/config");
class todoController extends controllers_dto_1.Todo {
    CREATE_TODO(req, res) { }
    ;
    READ_TODO(req, res) { }
    ;
    UPDATE_TODO(req, res) { }
    ;
    DELETE_TODO(req, res) { }
    ;
    constructor() {
        super();
        this.CREATE_TODO = function (req, res) {
            try {
                let todo_chunk = "";
                req.on("data", (chunk) => { todo_chunk += chunk; });
                req.on("end", () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const todo = JSON.parse(todo_chunk);
                        const todos = yield (controlFileEvent_1.default.read_file("todos.json"));
                        const validation_todo = new validation_1.todoValidation();
                        if (validation_todo.validation_create(todo)) {
                            const token = req.headers.token;
                            const verify_token = jwt_1.default.verify_token(token);
                            todo.todo_title = (todo.todo_title.toLowerCase());
                            todo.is_complate = 1;
                            todo.id = todos.length ? todos[todos.length - 1].id + 1 : 1;
                            todo.user_id = verify_token.user_id;
                            todos.push(todo);
                            const save_todo = yield controlFileEvent_1.default.write_file("todos.json", todos);
                            if (!save_todo)
                                throw new errors_1.ServerError("Todo not saved");
                            const result = {
                                message: "Todo is saved",
                                status: 201,
                                todo
                            };
                            res.statusCode = 201;
                            res.end(JSON.stringify(result));
                        }
                    }
                    catch (error) {
                        (0, errors_1.globalError)(res, error);
                    }
                }));
            }
            catch (error) {
                (0, errors_1.globalError)(res, error);
            }
        };
        this.UPDATE_TODO = function (req, res) {
            try {
                let todo_chunk = "";
                req.on("data", (chunk) => { todo_chunk += chunk; });
                req.on("end", () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const change_todo = JSON.parse(todo_chunk);
                        const todos = yield (controlFileEvent_1.default.read_file("todos.json"));
                        const validation_todo = new validation_1.todoValidation();
                        if (validation_todo.validation_edit(change_todo)) {
                            const todo_id = Number(req.url.trim().split("/").at(-1));
                            if (!todo_id)
                                throw new errors_1.ClientError("NOT FOUND", 404);
                            const find_index_todo = todos.findIndex((t) => t.id == todo_id);
                            if (find_index_todo == -1)
                                throw new errors_1.ClientError("NOT FOUND", 404);
                            const token = req.headers.token;
                            const verify_token = jwt_1.default.verify_token(token);
                            const todo = todos[find_index_todo];
                            if (todo.user_id != verify_token.user_id)
                                throw new errors_1.ClientError("Todo is not edit", 400);
                            todo.todo_title = change_todo.todo_title;
                            todo.is_complate = change_todo.is_complate;
                            const save_todo = yield controlFileEvent_1.default.write_file("todos.json", todos);
                            if (!save_todo)
                                throw new errors_1.ServerError("Todo is not changed");
                            const result = {
                                message: "Todo is changed",
                                status: 200,
                                todo
                            };
                            res.statusCode = 200;
                            res.end(JSON.stringify(result));
                        }
                    }
                    catch (error) {
                        (0, errors_1.globalError)(res, error);
                    }
                }));
            }
            catch (error) {
                (0, errors_1.globalError)(res, error);
            }
        };
        this.DELETE_TODO = function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const todos = yield (controlFileEvent_1.default.read_file("todos.json"));
                    const todo_id = Number(req.url.trim().split("/").at(-1));
                    if (!todo_id)
                        throw new errors_1.ClientError("NOT FOUND", 404);
                    const find_index_todo = todos.findIndex((t) => t.id == todo_id);
                    if (find_index_todo == -1)
                        throw new errors_1.ClientError("NOT FOUND", 404);
                    const token = req.headers.token;
                    const verify_token = jwt_1.default.verify_token(token);
                    const todo = todos[find_index_todo];
                    if (todo.user_id != verify_token.user_id)
                        throw new errors_1.ClientError("Todo is not deleted", 400);
                    todos.splice(find_index_todo, 1);
                    const delete_todo = yield controlFileEvent_1.default.write_file("todos.json", todos);
                    if (!delete_todo)
                        throw new errors_1.ServerError("Todo is not deleted");
                    const result = {
                        message: "Todo is deleted",
                        status: 200,
                    };
                    res.statusCode = 200;
                    res.end(JSON.stringify(result));
                }
                catch (error) {
                    (0, errors_1.globalError)(res, error);
                }
            });
        };
        this.READ_TODO = function (req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const req_url = req.url.trim().toLowerCase();
                    if (req_url.startsWith("/api/todos/all")) {
                        const todos = yield (controlFileEvent_1.default.read_file("todos.json"));
                        res.statusCode = 200;
                        res.end(JSON.stringify(todos));
                    }
                    else if (req_url.startsWith("/api/todos/")) {
                        const todo_id = Number(req_url.split("/").at(-1));
                        if (!todo_id)
                            throw new errors_1.ClientError("NOT FOUND", 404);
                        const todos = yield (controlFileEvent_1.default.read_file("todos.json"));
                        const find_index_todo = todos.findIndex((t) => t.id == todo_id);
                        if (find_index_todo == -1)
                            throw new errors_1.ClientError("NOT FOUND", 404);
                        const result = todos[find_index_todo];
                        res.statusCode = 200;
                        res.end(JSON.stringify(result));
                    }
                    else if (req_url.startsWith("/api/todos?")) {
                        const todos = yield (controlFileEvent_1.default.read_file("todos.json"));
                        if (todos.length) {
                            const query_url = `http://localhost:${config_1.configuration.port}${req_url}`;
                            const url = new URL(query_url);
                            const query_object = Object.fromEntries(url.searchParams);
                            const query_store = [];
                            for (const todo of todos) {
                                let store;
                                for (const key in todo) {
                                    if (todo[key] == query_object[key])
                                        store = todo;
                                }
                                if (store)
                                    query_store.push(store);
                            }
                            res.statusCode = 200;
                            res.end(JSON.stringify(query_store));
                        }
                    }
                }
                catch (error) {
                    (0, errors_1.globalError)(res, error);
                }
            });
        };
    }
}
exports.default = new todoController();
