import { User } from "./user";
import { MetaData } from "../metadata";

export interface UsersResponse {
    status: string;
    message: string;
    data: {
        data: User[];
        meta: MetaData;
    };
}