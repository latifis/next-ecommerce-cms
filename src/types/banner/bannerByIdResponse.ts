import { Banner } from "./banner";

export interface BannerByIdResponse {
    status: string;
    message: string;
    data: Banner;
}