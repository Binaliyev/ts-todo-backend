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
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises");
const conFileEvent_dto_1 = require("../dto/conFileEvent.dto");
class controlFileEvent extends conFileEvent_dto_1.ReadAndWrite {
    read_file(file) { }
    ;
    write_file(file, data) { }
    ;
    constructor() {
        super();
        this.read_file = (file) => __awaiter(this, void 0, void 0, function* () {
            const file_path = path_1.default.resolve("db", file);
            let users = yield (0, promises_1.readFile)(file_path, "utf8");
            return JSON.parse(users);
        });
        this.write_file = (file, data) => __awaiter(this, void 0, void 0, function* () {
            const file_path = path_1.default.resolve("db", file);
            yield (0, promises_1.writeFile)(file_path, JSON.stringify(data, null, 4));
            return true;
        });
    }
}
exports.default = new controlFileEvent();
