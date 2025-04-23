import { MetaData } from "../metadata";
import { Banner } from "./banner";

export interface BannersResponse {
    status: string;
    message: string;
    data: {
        data: Banner[];
        meta: MetaData;
    };
}