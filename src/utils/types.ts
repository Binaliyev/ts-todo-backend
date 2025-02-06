import { IncomingMessage, ServerResponse } from "http";

export type RequestType = IncomingMessage;
export type ResponseType = ServerResponse<IncomingMessage>;
export type USER = {
    firstname?: string,
    lastname?: string,
    email: string,
    password: string,
    id?: number
}
export type ErrorType = {
    message: string,
    status: number
}
export type TODO = {
    todo_title: string,
    is_complate?: number,
    user_id?: number,
    id?: number,
}

export type authResultType = ErrorType & {token:string}
export type todoResultType = ErrorType & {todo?:TODO};


export interface ConfigurationInterface {
    port: number,
    token_key: string
}

export interface JWTInterface {
    user_id: number,
    user_agent: string
}
