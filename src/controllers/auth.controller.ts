import { Auth } from "../dto/controllers.dto";
import jwt from "../jwt/jwt";
import controlFileEvent from "../models/controlFileEvent";
import { ClientError, globalError, ServerError } from "../utils/errors";
import { authResultType, ErrorType, RequestType, ResponseType, USER } from "../utils/types";
import { userValidation } from "../utils/validation";

class authController extends Auth {
    REGISTER(req: RequestType, res: ResponseType): void { };
    LOGIN(req: RequestType, res: ResponseType): void { };
    constructor() {
        super();
        this.REGISTER = function (req: RequestType, res: ResponseType): void {
            try {
                let user_chunk: string = "";
                req.on("data", (chunk) => { user_chunk += chunk });
                req.on("end", async () => {
                    try {
                        const users: USER[] = await (controlFileEvent.read_file("users.json")) as USER[];
                        const user: USER = JSON.parse(user_chunk);
                        const validation_user: userValidation = new userValidation();
                        if (validation_user.validation_register(user)) {
                            const check_user: boolean = users.some((u: USER) => u.email == user.email);
                            if (check_user) throw new ClientError("This user already exists", 400);
                            user.id = users.length ? (users[users.length - 1].id as number) + 1 : 1;
                            users.push(user);
                            const save_user: boolean | void = await (controlFileEvent.write_file("users.json", users));
                            if (!save_user) throw new ServerError("USER not save");
                            const result: authResultType = {
                                message: "User saved successfully",
                                status: 201,
                                token: jwt.create_token({ user_id: user.id, user_agent: req.headers["user-agent"] as string }) as string,
                            }
                            res.statusCode = 201;
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
        this.LOGIN = function (req: RequestType, res: ResponseType): void {
            try {
                let user_chunk: string = "";
                req.on("data", (chunk) => { user_chunk += chunk });
                req.on("data", async () => {
                    try {
                        const users: USER[] = await (controlFileEvent.read_file("users.json")) as USER[];
                        const user: USER = JSON.parse(user_chunk);
                        const validation_user: userValidation = new userValidation();
                        if (validation_user.validation_login(user)) {
                            const check_user_email: USER | undefined = users.find((u: USER) => u.email == user.email);
                            if (!check_user_email) throw new ClientError("User not found", 404);
                            if (check_user_email.password != user.password) throw new ClientError("User not found", 404);
                            const result: authResultType = {
                                message: "User logined successfully",
                                status: 200,
                                token: jwt.create_token({ user_id: check_user_email.id as number, user_agent: req.headers["user-agent"] as string }) as string,
                            }
                            res.statusCode = 200;
                            res.end(JSON.stringify(result));
                        }
                    } catch (error) {
                        globalError(res, error as ErrorType)
                    }
                })
            } catch (error) {
                globalError(res, (error as ErrorType));
            }
        }
    }
};
export default new authController();