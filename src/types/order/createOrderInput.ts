export type CreateOrderInput = {
    items: {
        productId: string;
        quantity: number;
    }[];
};