import { User } from "./user";

export interface UserResponse {
    status: string;
    message: string;
    data: User;
}