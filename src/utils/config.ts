import c from "config";
import { ConfigurationInterface } from "./types";

export enum METHODS {
    CREATE = "POST",
    READ = "GET",
    UPDATE = "PUT",
    DELETE = "DELETE"
}

export const configuration: ConfigurationInterface = {
    port: c.get("PORT") || 5600,
    token_key: c.get("TOKEN_KEY"),
}