import { ProductDatabaseRow } from "../types/productTypes"

export const formatProduct = (data: ProductDatabaseRow) => {
  return {
    productId: data.id,
    productName: data.product_name,
    categoryId: data.category_id,
    price: Number(data.price),
    inStock: data.in_stock,
    imgUrl: data.img_url,
    desc: data.description,
    attributes: data.attributes,
    isAvailable: data.is_available,
    categoryName: data.type
  }
}