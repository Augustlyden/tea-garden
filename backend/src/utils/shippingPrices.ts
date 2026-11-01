export type ShippingMethod = 'servicePoint' | 'homeDelivery'

const SHIPPING_PRICES: Record<ShippingMethod, number> = { servicePoint: 59, homeDelivery: 99 }
export const FREE_SHIPPING_FROM = 500 

export function calculateShippingPrice(method: ShippingMethod, goodsTotal: number): number {
  return goodsTotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_PRICES[method]
}

export function calculateAllShippingPrices(goodsTotal: number) {
  return {
    servicePoint: calculateShippingPrice('servicePoint', goodsTotal),
    homeDelivery: calculateShippingPrice('homeDelivery', goodsTotal),
    freeShippingFrom: FREE_SHIPPING_FROM,
  }
}