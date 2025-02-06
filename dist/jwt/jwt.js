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
const jsonwebtoken_1 = require("jsonwebtoken");
const jwt_dto_1 = require("../dto/jwt.dto");
const config_1 = require("../utils/config");
const errors_1 = require("../utils/errors");
const controlFileEvent_1 = __importDefault(require("../models/controlFileEvent"));
class jwtServis extends jwt_dto_1.JWT {
    create_token(data) { }
    ;
    verify_token(token) { }
    ;
    check_token(req, res) { }
    ;
    constructor() {
        super();
        this.create_token = (data) => (0, jsonwebtoken_1.sign)(data, config_1.configuration.token_key, { expiresIn: "5d" });
        this.verify_token = (token) => (0, jsonwebtoken_1.verify)(token, config_1.configuration.token_key);
        this.check_token = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.headers.token;
                if (!token)
                    throw new errors_1.ClientError("User is unauthorized", 401);
                const verifyToken = this.verify_token(token);
                const users = yield (controlFileEvent_1.default.read_file("users.json"));
                const user = users.find((u) => u.id == verifyToken.user_id);
                if (!user)
                    throw new errors_1.ClientError("Token is Invalid", 401);
                if (req.headers["user-agent"] != verifyToken.user_agent)
                    throw new errors_1.ClientError("Token is Invalid", 401);
                return true;
            }
            catch (error) {
                (0, errors_1.globalError)(res, error);
            }
        });
    }
}
exports.default = new jwtServis();
