import { PriceType } from "@/enum/priceType"

export interface ItemsOrder {
    id: string,
    quantity: number,
    subtotal: string,
    product: {
        id: string,
        name: string,
        price: number,
        imageUrl: string,
        minQuantityForDiscount: number,
        discountPercentage: number,
        bulkDiscountPrice: number
    }
    priceAtOrder: string,
    priceType: PriceType,
    createdAt: string,
    updatedAt: string,
    orderId: string,
    productId: string,
}