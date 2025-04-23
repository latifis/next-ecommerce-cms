import { TopCategories } from "./topCategories";

export interface TopCategoriesResponse {
    status: string;
    message: string;
    data: {
        topCategories: TopCategories[];
    };
}