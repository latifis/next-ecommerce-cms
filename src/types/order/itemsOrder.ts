export interface ItemsOrder {
    id: string,
    quantity: number,
    subtotal: string,
    product: {
        id: string,
        name: string,
        price: number,
        imageUrl: string,
        imageUrlInput: string
    }
}