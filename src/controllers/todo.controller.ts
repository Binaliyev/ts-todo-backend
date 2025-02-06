import { Todo } from "../dto/controllers.dto";
import controlFileEvent from "../models/controlFileEvent";
import { ClientError, globalError, ServerError } from "../utils/errors";
import { ErrorType, JWTInterface, RequestType, ResponseType, TODO, todoResultType } from "../utils/types";
import { todoValidation } from "../utils/validation";
import jwt from "../jwt/jwt";
import { configuration } from "../utils/config";

class todoController extends Todo {
    CREATE_TODO(req: RequestType, res: ResponseType): void { };
    READ_TODO(req: RequestType, res: ResponseType): Promise<void> | void { };
    UPDATE_TODO(req: RequestType, res: ResponseType): void { };
    DELETE_TODO(req: RequestType, res: ResponseType): Promise<void> | void { };
    constructor() {
        super()
        this.CREATE_TODO = function (req: RequestType, res: ResponseType): void {
            try {
                let todo_chunk: string = "";
                req.on("data", (chunk) => { todo_chunk += chunk });
                req.on("end", async () => {
                    try {
                        const todo: TODO = JSON.parse(todo_chunk);
                        const todos: TODO[] = await (controlFileEvent.read_file("todos.json")) as TODO[];
                        const validation_todo: todoValidation = new todoValidation();
                        if (validation_todo.validation_create(todo)) {
                            const token: string = req.headers.token as string;
                            const verify_token: JWTInterface = jwt.verify_token(token) as JWTInterface;
                            todo.todo_title = (todo.todo_title.toLowerCase());
                            todo.is_complate = 1;
                            todo.id = todos.length ? (todos[todos.length - 1].id as number) + 1 : 1;
                            todo.user_id = verify_token.user_id;
                            todos.push(todo);
                            const save_todo: boolean | void = await controlFileEvent.write_file("todos.json", todos);
                            if (!save_todo) throw new ServerError("Todo not saved");
                            const result: todoResultType = {
                                message: "Todo is saved",
                                status: 201,
                                todo
                            }
                            res.statusCode = 201;
                            res.end(JSON.stringify(result));
                        }
                    } catch (error) {
                        globalError(res, (error as ErrorType))
                    }
                })
            } catch (error) {
                globalError(res, (error as ErrorType))
            }
        }
        this.UPDATE_TODO = function (req: RequestType, res: ResponseType): void {
            try {
                let todo_chunk: string = "";
                req.on("data", (chunk) => { todo_chunk += chunk });
                req.on("end", async () => {
                    try {
                        const change_todo: TODO = JSON.parse(todo_chunk);
                        const todos: TODO[] = await (controlFileEvent.read_file("todos.json")) as TODO[];
                        const validation_todo: todoValidation = new todoValidation();
                        if (validation_todo.validation_edit(change_todo)) {
                            const todo_id: number = Number((req.url as string).trim().split("/").at(-1));
                            if (!todo_id) throw new ClientError("NOT FOUND", 404);
                            const find_index_todo: number = todos.findIndex((t: TODO) => t.id == todo_id);
                            if (find_index_todo == -1) throw new ClientError("NOT FOUND", 404);
                            const token: string = req.headers.token as string;
                            const verify_token: JWTInterface = jwt.verify_token(token) as JWTInterface;
                            const todo: TODO = todos[find_index_todo];
                            if (todo.user_id != verify_token.user_id) throw new ClientError("Todo is not edit", 400);
                            todo.todo_title = change_todo.todo_title;
                            todo.is_complate = change_todo.is_complate;
                            const save_todo: boolean | void = await controlFileEvent.write_file("todos.json", todos);
                            if (!save_todo) throw new ServerError("Todo is not changed");
                            const result: todoResultType = {
                                message: "Todo is changed",
                                status: 200,
                                todo
                            }
                            res.statusCode = 200;
                            res.end(JSON.stringify(result));
                        }
                    } catch (error) {
                        globalError(res, (error as ErrorType));
                    }
                })
            } catch (error) {
                globalError(res, (error as ErrorType));
            }
        };
        this.DELETE_TODO = async function (req: RequestType, res: ResponseType): Promise<void> {
            try {
                const todos: TODO[] = await (controlFileEvent.read_file("todos.json")) as TODO[];
                const todo_id: number = Number((req.url as string).trim().split("/").at(-1));
                if (!todo_id) throw new ClientError("NOT FOUND", 404);
                const find_index_todo: number = todos.findIndex((t: TODO) => t.id == todo_id);
                if (find_index_todo == -1) throw new ClientError("NOT FOUND", 404);
                const token: string = req.headers.token as string;
                const verify_token: JWTInterface = jwt.verify_token(token) as JWTInterface;
                const todo: TODO = todos[find_index_todo];
                if (todo.user_id != verify_token.user_id) throw new ClientError("Todo is not deleted", 400);
                todos.splice(find_index_todo, 1);
                const delete_todo: boolean | void = await controlFileEvent.write_file("todos.json", todos);
                if (!delete_todo) throw new ServerError("Todo is not deleted");
                const result: todoResultType = {
                    message: "Todo is deleted",
                    status: 200,
                }
                res.statusCode = 200;
                res.end(JSON.stringify(result));

            } catch (error) {
                globalError(res, (error as ErrorType));
            }
        };
        this.READ_TODO = async function (req: RequestType, res: ResponseType): Promise<void> {
            try {
                const req_url: string = (req.url as string).trim().toLowerCase();
                if (req_url.startsWith("/api/todos/all")) {
                    const todos: TODO[] = await (controlFileEvent.read_file("todos.json")) as TODO[];
                    res.statusCode = 200;
                    res.end(JSON.stringify(todos));
                } else if (req_url.startsWith("/api/todos/")) {
                    const todo_id: number = Number(req_url.split("/").at(-1));
                    if (!todo_id) throw new ClientError("NOT FOUND", 404);
                    const todos: TODO[] = await (controlFileEvent.read_file("todos.json")) as TODO[];
                    const find_index_todo: number = todos.findIndex((t: TODO) => t.id == todo_id);
                    if (find_index_todo == -1) throw new ClientError("NOT FOUND", 404);
                    const result: TODO = todos[find_index_todo];
                    res.statusCode = 200;
                    res.end(JSON.stringify(result));
                } else if (req_url.startsWith("/api/todos?")) {
                    const todos: TODO[] = await (controlFileEvent.read_file("todos.json")) as TODO[];
                    if (todos.length) {
                        const query_url: string = `http://localhost:${configuration.port}${req_url}`;
                        const url: URL = new URL(query_url);
                        const query_object = Object.fromEntries(url.searchParams);
                        const query_store: TODO[] = [];
                        for (const todo of todos) {
                            let store: TODO | undefined;
                            for (const key in todo) {
                                if (todo[key as keyof TODO] == query_object[key]) store = todo
                            }
                            if (store) query_store.push(store);
                        }
                        res.statusCode = 200;
                        res.end(JSON.stringify(query_store));
                    }
                }
            } catch (error) {
                globalError(res, (error as ErrorType))
            }
        }
    }
}

export default new todoController()