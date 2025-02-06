import { ValidationTodo, ValidationUser } from "../dto/validation.dto";
import { ClientError } from "./errors";
import { TODO, USER } from "./types";

const email_regex: RegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const password_regex: RegExp = /[0-9]{5}[abc]/;
export class userValidation extends ValidationUser {
    validation_register(user: USER): boolean | void { };
    validation_login(user: USER): boolean | void { };
    constructor() {
        super();
        this.validation_register = function (user: USER): boolean | void {
            const { firstname, lastname, email, password } = user;
            if (!firstname) throw new ClientError("Firstname is requared !", 400);
            if (!lastname) throw new ClientError("Lastname is requared !", 400);
            if (!email) throw new ClientError("Email is requared !", 400);
            if (!(email_regex.test(email))) throw new ClientError("Invalid email !", 400);
            if (!password) throw new ClientError("Password is requared !", 400);
            if (!(password_regex.test(password) && password.length < 15)) throw new ClientError("Invalid password !", 400);
            return true;
        };
        this.validation_login = function (user: USER): boolean | void {
            const { email, password } = user;
            if (!email) throw new ClientError("Email is requared !", 400);
            if (!(email_regex.test(email))) throw new ClientError("Invalid email !", 400);
            if (!password) throw new ClientError("Password is requared !", 400);
            if (!(password_regex.test(password) && password.length < 15)) throw new ClientError("Invalid password !", 400);
            return true;
        }
    }
};


export class todoValidation extends ValidationTodo {
    validation_create(todo: TODO): boolean | void { }
    validation_edit(todo: TODO): boolean | void { }
    constructor() {
        super()
        this.validation_create = (todo: TODO): boolean | void => {
            if (!(todo.todo_title)) throw new ClientError("Todo title is requered !", 400)
            return true
        }
        this.validation_edit = (todo: TODO): boolean | void => {
            const { todo_title, is_complate } = todo
            if (!todo_title) throw new ClientError("Todo title is requered !", 400)
            if (!is_complate) throw new ClientError("Complate is requered !", 400)
            if (is_complate > 2 || is_complate < 1) throw new ClientError("Complate value is invalid !", 400)
            return true
        }
    }
}