import { ErrorType, ResponseType } from "./types";

export class ClientError extends Error {
    status:number;
    constructor(message: string, status: number){
        super(message);
        this.message = `ClientError: ${message}`;
        this.status = status;
    }
}

export class ServerError extends Error {
    status:number;
    constructor(message: string){
        super(message);
        this.message = `ServerError: ${message}`;
        this.status = 500;
    }
}

export const globalError = (res:ResponseType, err: ErrorType) => {
    if (res.writableEnded) return;
    const error: ErrorType = {
        message: err.message,
        status: err.status || 500
    }
    res.statusCode = err.status;
    return res.end(JSON.stringify(error))
}