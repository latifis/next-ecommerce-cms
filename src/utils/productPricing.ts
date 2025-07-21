import { ProductPriceInput } from "@/types/statistics/productPriceInput";

/**
 * Calculate the unit price of a product based on its quantity and discount.
 */
export function calculateUnitPrice({
  quantity,
  price,
  discountPercentage,
  minQuantityForDiscount,
  bulkDiscountPrice,
}: ProductPriceInput): number {
  const minQty =
    typeof minQuantityForDiscount === 'string'
      ? parseInt(minQuantityForDiscount)
      : minQuantityForDiscount;

  if (quantity >= minQty && bulkDiscountPrice > 0) {
    return bulkDiscountPrice;
  }

  const discount = (discountPercentage / 100) * price;
  return price - discount;
}

/**
 * Calculate the subtotal price of a product based on its quantity and discount.
 */
export function calculateSubtotalPrice(input: ProductPriceInput): number {
  const unitPrice = calculateUnitPrice(input);
  return unitPrice * input.quantity;
}

/**
 * Calculate the total price of a list of products.
 */
export function calculateTotalPrice(items: ProductPriceInput[]): number {
  return items.reduce((total, item) => total + calculateSubtotalPrice(item), 0);
}
