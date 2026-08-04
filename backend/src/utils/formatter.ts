import { 
  CartDatabaseRow, 
  CartInstance, 
  CartWithProduct, 
  CartWithProductDatabaseRow 
} from "../types/cartTypes";
import { 
  ProductDatabaseRow, 
  ProductInstance, 
  UserProductInstance 
} from "../types/productTypes";

export const formatProduct = (data: ProductDatabaseRow): ProductInstance => {
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
    categoryName: data.type,
    isDeleted: data.is_deleted
  }
}

export const formatUserProduct = (data: ProductDatabaseRow): UserProductInstance => {
  return {
    productId: data.id,
    productName: data.product_name,
    categoryId: data.category_id,
    price: Number(data.price),
    inStock: data.in_stock,
    imgUrl: data.img_url,
    desc: data.description,
    attributes: data.attributes,
    categoryName: data.type,
  }
}

export const formatCart = (data: CartDatabaseRow): CartInstance => {
  return {
    cartId: data.id,
    productId: data.product_id,
    quantity: data.quantity,
    cartToken: data.cart_token
  }
}

export const formatProductCart = (data: CartWithProductDatabaseRow): CartWithProduct => {
  return {
    cartId: data.id,
    productId: data.product_id,
    quantity: data.quantity,
    cartToken: data.cart_token,
    productName: data.product_name,
    price: Number(data.price),
    subTotal: Number(data.sub_total),
    imgUrl: data.img_url,
    isAvailable: data.is_available,
    isDeleted: data.is_deleted
  }
}