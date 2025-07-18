import { User } from "./user";

export interface UserByIdResponse {
    status: string;
    message: string;
    data: User;
}