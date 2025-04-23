export interface Product {
    id?: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    imageUrlInput?: string;
    file?: File;
    categoryId?: string;
    createdBy: string;
    createdAt?: string;
    updatedBy?: string;
    updatedAt?: string;
    categoryName?: string;
    brandId?: string;
    brandName?: string;
    unit?: string;
    discountPercentage: number;
    minQuantityForDiscount: number;
    bulkDiscountPrice: number;
}
