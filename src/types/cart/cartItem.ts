export interface CartItem {
    id: string;
    code: string;
    name: string;
    price: number;
    imageUrl: string;
    bulkDiscountPrice: number;
    discountPercentage: number;
    minQuantityForDiscount: number;
    quantity: number;
}