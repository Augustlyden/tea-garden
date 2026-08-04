import { ValidationResult } from "../types/productTypes";

const fieldTranslation: Record<string, string> = {
  price: 'Priset',
  inStock: 'Lagersaldot',
  categoryId: 'Kategorin'
};

export const validateProductNumbers = (
  productData: any, 
  isUpdate: boolean = false
): ValidationResult => {
  const numberFields = ['price', 'inStock', 'categoryId'];

  for (const field of numberFields) {
    const value = productData[field];
    const displayField = fieldTranslation[field] || field;

    if (value === undefined) {
      if (!isUpdate) {
        return { valid: false, error: `${displayField} måste anges.` };
      }
      continue;
    }

    if (value === '') {
      if (!isUpdate) {
        return { valid: false, error: `${displayField} får inte vara tomt.`};
      }
      delete productData[field];
      continue;
    }

    const parsedNumber = Number(value);
    if (Number.isNaN(parsedNumber)) {
      return { valid: false, error: `${displayField} måste vara ett giltig nummer.`};
    }

    if ((field === 'inStock' || field === 'categoryId') && !Number.isInteger(parsedNumber)) {
      return { valid: false, error: `${displayField} måste vara ett heltal.`};
    }

    if (parsedNumber < 0) {
      return { valid: false, error: `${displayField} får inte vara negativt.`};
    }

    productData[field] = parsedNumber;
  }
  return { valid: true };
}

export const parseProductAttributes = (productData: any): ValidationResult => {
  if (productData.attributes !== undefined) {
    const attrValue = productData.attributes;

    if (attrValue === '') {
      productData.attributes = {};
    } else if (typeof attrValue === 'string') {
      try {
        productData.attributes = JSON.parse(attrValue);
      } catch (error) {
        return { valid: false, error: 'Attributen har ett ogiltigt JSON-format'}
      }
    }
  }
  return { valid: true };
}