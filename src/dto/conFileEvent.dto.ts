import { TODO, USER } from "../utils/types";
export abstract class ReadAndWrite {
    abstract read_file(file:string): Promise<USER[] | TODO[] | []> | void;
    abstract write_file(file: string, data: USER[] | TODO[]): Promise<boolean | void> | void;
    constructor(){}
}