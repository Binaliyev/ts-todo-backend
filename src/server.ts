import http from "node:http"
import { globalError } from "./utils/errors";
import authController from "./controllers/auth.controller";
import { configuration, METHODS } from "./utils/config";
import jwt from "./jwt/jwt";
import todoController from "./controllers/todo.controller";

const server = http.createServer(async (req, res) => {
    const req_url: string = (req.url as string).trim().toLowerCase();
    const req_method: string = (req.method as string).trim().toUpperCase();
    res.setHeader("Content-type", "application/json");
    if (req_url.startsWith('/api')) {
        if (req_url.startsWith("/api/auth")) {
            if (req_url.startsWith("/api/auth/register") && req_method == METHODS.CREATE) authController.REGISTER(req, res);
            if (req_url.startsWith("/api/auth/login") && req_method == METHODS.CREATE) authController.LOGIN(req, res);
        } else if (await jwt.check_token(req, res)) {
            if (req_url.startsWith("/api/todos") && req_method == METHODS.CREATE) todoController.CREATE_TODO(req, res);
            if (req_url.startsWith("/api/todos/") && req_method == METHODS.UPDATE) todoController.UPDATE_TODO(req, res);
            if (req_url.startsWith("/api/todos/") && req_method == METHODS.DELETE) await todoController.DELETE_TODO(req, res);
            if (req_method == METHODS.READ && (req_url.startsWith("/api/todos/all") || req_url.startsWith("/api/todos/"))) await todoController.READ_TODO(req, res);
            if (req_url.startsWith("/api/todos?") && req_method == METHODS.READ) await todoController.READ_TODO(req, res);
        }

    } else globalError(res, { message: "Invalid url", status: 404 });
})

server.listen(configuration.port, () => console.log(`Server runing in ${configuration.port}-port`))
