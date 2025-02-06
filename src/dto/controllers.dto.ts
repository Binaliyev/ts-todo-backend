import { RequestType, ResponseType } from "../utils/types";

export abstract class Auth {
    abstract REGISTER(req: RequestType, res: ResponseType): void;
    abstract LOGIN(req: RequestType, res: ResponseType): void;
    constructor() { };
}

export abstract class Todo {
    abstract CREATE_TODO(req: RequestType, res: ResponseType): void;
    abstract READ_TODO(req: RequestType, res: ResponseType): Promise<void> | void;
    abstract UPDATE_TODO(req: RequestType, res: ResponseType): void;
    abstract DELETE_TODO(req: RequestType, res: ResponseType): Promise<void> | void;
    constructor() { };
}
