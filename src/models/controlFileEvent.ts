import path from "path";
import { readFile, writeFile } from "fs/promises";
import { ReadAndWrite } from "../dto/conFileEvent.dto";
import { TODO, USER } from "../utils/types";

class controlFileEvent extends ReadAndWrite {
    read_file(file: string): Promise<USER[] | []>  | void {};
    write_file(file: string, data: USER[]| TODO[]): Promise<boolean | void> | void {};
    constructor(){
        super()
        this.read_file = async (file: string): Promise<USER[] | []> => {
            const file_path: string = path.resolve("db", file);
            let users: string = await readFile(file_path, "utf8");
            return JSON.parse(users);
        };
        this.write_file= async (file:string, data: USER[] | TODO[]): Promise<boolean | void> => {
            const file_path: string = path.resolve("db", file);
            await writeFile(file_path, JSON.stringify(data, null, 4));
            return true
        }
    }
}

export default new controlFileEvent();