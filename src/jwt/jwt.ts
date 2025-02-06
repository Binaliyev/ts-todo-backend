import { JwtPayload, sign, verify } from "jsonwebtoken";
import { JWT } from "../dto/jwt.dto";
import { ErrorType, JWTInterface, RequestType, ResponseType, USER } from "../utils/types";
import { configuration } from "../utils/config";
import { ClientError, globalError } from "../utils/errors";
import controlFileEvent from "../models/controlFileEvent";

class jwtServis extends JWT {
    create_token(data: JWTInterface): string | void { };
    verify_token(token: string): JwtPayload | string | void { };
    check_token(req: RequestType, res: ResponseType): Promise<boolean | void> | void { };
    constructor() {
        super();
        this.create_token = (data: JWTInterface): string => sign(data, configuration.token_key, { expiresIn: "5d" });
        this.verify_token = (token: string): JwtPayload | string => verify(token, configuration.token_key);
        this.check_token = async (req: RequestType, res: ResponseType): Promise<boolean | void> => {
            try {
                const token = req.headers.token;
                if (!token) throw new ClientError("User is unauthorized", 401);
                const verifyToken: JWTInterface = this.verify_token(token as string) as JWTInterface;
                const users: USER[] = await (controlFileEvent.read_file("users.json")) as USER[];
                const user: USER = users.find((u:USER) => u.id == verifyToken.user_id) as USER;
                if(!user) throw new ClientError("Token is Invalid", 401);
                if(req.headers["user-agent"] != verifyToken.user_agent) throw new ClientError("Token is Invalid", 401);
                return true;
            } catch (error) {
                globalError(res, error as ErrorType);
            }
        }
    }
}

export default new jwtServis();