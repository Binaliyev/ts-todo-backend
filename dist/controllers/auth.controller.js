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
const jwt_1 = __importDefault(require("../jwt/jwt"));
const controlFileEvent_1 = __importDefault(require("../models/controlFileEvent"));
const errors_1 = require("../utils/errors");
const validation_1 = require("../utils/validation");
class authController extends controllers_dto_1.Auth {
    REGISTER(req, res) { }
    ;
    LOGIN(req, res) { }
    ;
    constructor() {
        super();
        this.REGISTER = function (req, res) {
            try {
                let user_chunk = "";
                req.on("data", (chunk) => { user_chunk += chunk; });
                req.on("end", () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const users = yield (controlFileEvent_1.default.read_file("users.json"));
                        const user = JSON.parse(user_chunk);
                        const validation_user = new validation_1.userValidation();
                        if (validation_user.validation_register(user)) {
                            const check_user = users.some((u) => u.email == user.email);
                            if (check_user)
                                throw new errors_1.ClientError("This user already exists", 400);
                            user.id = users.length ? users[users.length - 1].id + 1 : 1;
                            users.push(user);
                            const save_user = yield (controlFileEvent_1.default.write_file("users.json", users));
                            if (!save_user)
                                throw new errors_1.ServerError("USER not save");
                            const result = {
                                message: "User saved successfully",
                                status: 201,
                                token: jwt_1.default.create_token({ user_id: user.id, user_agent: req.headers["user-agent"] }),
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
        this.LOGIN = function (req, res) {
            try {
                let user_chunk = "";
                req.on("data", (chunk) => { user_chunk += chunk; });
                req.on("data", () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const users = yield (controlFileEvent_1.default.read_file("users.json"));
                        const user = JSON.parse(user_chunk);
                        const validation_user = new validation_1.userValidation();
                        if (validation_user.validation_login(user)) {
                            const check_user_email = users.find((u) => u.email == user.email);
                            if (!check_user_email)
                                throw new errors_1.ClientError("User not found", 404);
                            if (check_user_email.password != user.password)
                                throw new errors_1.ClientError("User not found", 404);
                            const result = {
                                message: "User logined successfully",
                                status: 200,
                                token: jwt_1.default.create_token({ user_id: check_user_email.id, user_agent: req.headers["user-agent"] }),
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
    }
}
;
exports.default = new authController();
