import { Brand } from "./brand";

export interface BrandByIdResponse {
    status: string;
    message: string;
    data: Brand;
}