import { JwtPayload } from "jsonwebtoken";
import { JWTInterface, RequestType, ResponseType } from "../utils/types";

export abstract class JWT {
    abstract create_token(data: JWTInterface): string | void;
    abstract verify_token(token:string): JwtPayload | string | void;
    abstract check_token(req: RequestType, res: ResponseType): Promise<boolean | void> | void;
    constructor(){}
}