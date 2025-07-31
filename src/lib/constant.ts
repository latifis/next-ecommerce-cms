import { Banner } from "@/types/banner/banner";
import { Brand } from "@/types/brand/brand";
import { Category } from "@/types/category/category";
import { Order } from "@/types/order/order";
import { Product } from "@/types/product/product";
import { User } from "@/types/user/user";

export const CATEGORY_SORT_FIELDS: (keyof Category)[] = [
    "name", "updatedAt", "createdAt"
];

export const BRAND_SORT_FIELDS: (keyof Brand)[] = [
    "name", "description", "updatedAt"
];

export const PRODUCT_SORT_FIELDS: (keyof Product)[] = [
    "name", "price", "stock", "updatedAt"
];

export const BANNER_SORT_FIELDS: (keyof Banner)[] = [
    "name", "updatedAt"
];

export const ORDER_SORT_FIELDS: (keyof Order)[] = [
    "updatedAt"
];

export const USER_SORT_FIELDS: (keyof User)[] = [
    "name", "email", "phone", "updatedAt"
];

export const SORT_ORDER_ASC = 'asc';
export const SORT_ORDER_DESC = 'desc';

export const DEFAULT_USER_NAME = 'user@error.com';
export const DEFAULT_PRODUCT_URL = '/images/default-product.png'
export const DEFAULT_IMAGE_URL = '/images/default-product-image.webp';
export const DEFAULT_BRAND_URL = '/images/default-brand-image.webp';
export const DEFAULT_USER_URL = '/images/default-profile.png';