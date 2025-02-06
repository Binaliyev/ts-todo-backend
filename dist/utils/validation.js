"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoValidation = exports.userValidation = void 0;
const validation_dto_1 = require("../dto/validation.dto");
const errors_1 = require("./errors");
const email_regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const password_regex = /[0-9]{5}[abc]/;
class userValidation extends validation_dto_1.ValidationUser {
    validation_register(user) { }
    ;
    validation_login(user) { }
    ;
    constructor() {
        super();
        this.validation_register = function (user) {
            const { firstname, lastname, email, password } = user;
            if (!firstname)
                throw new errors_1.ClientError("Firstname is requared !", 400);
            if (!lastname)
                throw new errors_1.ClientError("Lastname is requared !", 400);
            if (!email)
                throw new errors_1.ClientError("Email is requared !", 400);
            if (!(email_regex.test(email)))
                throw new errors_1.ClientError("Invalid email !", 400);
            if (!password)
                throw new errors_1.ClientError("Password is requared !", 400);
            if (!(password_regex.test(password) && password.length < 15))
                throw new errors_1.ClientError("Invalid password !", 400);
            return true;
        };
        this.validation_login = function (user) {
            const { email, password } = user;
            if (!email)
                throw new errors_1.ClientError("Email is requared !", 400);
            if (!(email_regex.test(email)))
                throw new errors_1.ClientError("Invalid email !", 400);
            if (!password)
                throw new errors_1.ClientError("Password is requared !", 400);
            if (!(password_regex.test(password) && password.length < 15))
                throw new errors_1.ClientError("Invalid password !", 400);
            return true;
        };
    }
}
exports.userValidation = userValidation;
;
class todoValidation extends validation_dto_1.ValidationTodo {
    validation_create(todo) { }
    validation_edit(todo) { }
    constructor() {
        super();
        this.validation_create = (todo) => {
            if (!(todo.todo_title))
                throw new errors_1.ClientError("Todo title is requered !", 400);
            return true;
        };
        this.validation_edit = (todo) => {
            const { todo_title, is_complate } = todo;
            if (!todo_title)
                throw new errors_1.ClientError("Todo title is requered !", 400);
            if (!is_complate)
                throw new errors_1.ClientError("Complate is requered !", 400);
            if (is_complate > 2 || is_complate < 1)
                throw new errors_1.ClientError("Complate value is invalid !", 400);
            return true;
        };
    }
}
exports.todoValidation = todoValidation;
