import { LinkType } from "@/enum/linkType";

export interface Banner {
    id?: string;
    name: string;
    description?: string;
    sequence?: number;
    mediaType?: string;
    url: string;
    linkType?: LinkType;
    linkValue?: string;
    createdAt?: string;
    updatedAt?: string;
}