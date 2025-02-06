import { TODO, USER } from "../utils/types";

export abstract class ValidationUser {
    abstract validation_register(user:USER): boolean | void;
    abstract validation_login(user:USER): boolean | void;
    constructor(){}
}

export abstract class ValidationTodo {
    abstract validation_create(todo:TODO): boolean | void;
    abstract validation_edit(todo:TODO): boolean | void;
    constructor(){}
}