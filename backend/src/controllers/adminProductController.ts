import Product from "../models/AdminProduct";
import { Request, Response } from "express";
import { ProductAttributes } from "../types/productTypes";
import { ImportedProduct, parseProductAttributes, validateProductNumbers } from "../utils/productValidator";
import { uploadToCloudinary } from "../middlewares/upload";
import { getSupplierCatalog } from "../integrations/supplierAdapter";
import Category from "../models/Catergory";
import { AlgoliaProduct, indexProducts, removeProducts } from "../integrations/searchAdapter";
import UserProduct from "../models/UserProduct";

export const createProduct = async (
  req: Request<{}, {}, ProductAttributes>, res: Response
) => {
  try {
    const productData = req.body;
    const file = req.file as Express.Multer.File;

    if (!file) {
      return res.status(400).json({ success: false, error: 'Produktbild krävs.' })
    }

    const numValidation = validateProductNumbers(productData);
    if (!numValidation.valid) {
      return res.status(400).json({ success: false, error: numValidation.error });
    }

    const attrValidation = parseProductAttributes(productData);
    if (!attrValidation.valid) {
      return res.status(400).json({ success: false, error: attrValidation.error });
    }

    if (productData.isAvailable !== undefined) {
      productData.isAvailable = productData.isAvailable === 'true';
    }

    const uploadResult = await uploadToCloudinary(file.buffer);
    productData.imgUrl = uploadResult.secure_url;

    const newProduct = await Product.create(productData);

    try {
      const categoryRow = await Category.findAllCategories();
      const categories = new Map<number, string>();
      for (const category of categoryRow) {
        categories.set(category.id, category.type);
      }
      const algoliaProduct = {
        ...newProduct,
        categoryName: categories.get(newProduct.categoryId) || 'Okänd kategori',
      };
      await indexProducts([algoliaProduct]);
      res.status(201).json({ success: true, searchIndexed: true, data: newProduct });
    } catch (error) {
      console.warn('Error while indexing product to Algolia:', error);
      res.status(201).json({ success: true, searchIndexed: false, message: 'Produkten skapades men misslyckades att indexera till Algolia', data: newProduct });
    }
  } catch (error) {
    console.error('Error while creating product:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att skapa produkt' });
  }
};

export const getAllProductsAdmin = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAllAdmin();
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error while fetching products:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att hämta produkter' });
  }
};

export const getProductByIdAdmin = async (
  req: Request<{ id: string }>, res: Response
) => {
  try {
    const productId = Number(req.params.id);
    if (Number.isNaN(productId)) {
      return res.status(400).json({ success: false, error: 'Ogiltigt produkt-ID' });
    } 

    const product = await Product.findByIdAdmin(productId);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Produkten hittades ej.' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error while fetching product:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att hämta produkt' });
  }
};

export const updateProduct = async (
  req: Request<{ id: string }, {}, Partial<ProductAttributes>>,
  res: Response
) => {
  try {
    const productId = Number(req.params.id);
    if (Number.isNaN(productId)) {
      return res.status(400).json({ success: false, error: 'Ogiltigt produkt-ID' });
    }

    const productData = req.body;
    const file = req.file as Express.Multer.File;

    if (file) {
      const uploadResult = await uploadToCloudinary(file.buffer);
      productData.imgUrl = uploadResult.secure_url;
    } 

    const numValidation = validateProductNumbers(productData, true);
    if (!numValidation.valid) {
      return res.status(400).json({ success: false, error: numValidation.error });
    }

    const attrValidation = parseProductAttributes(productData);
    if (!attrValidation.valid) {
      return res.status(400).json({ success: false, error: attrValidation.error });
    }

    if (productData.isAvailable !== undefined) {
      productData.isAvailable = productData.isAvailable === 'true';
    }

    const product = await Product.update(productId, productData);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Produkten hittades ej' });
    }

    try {
      console.log(product.isAvailable);
      if (product.isAvailable) {
        const categoryRow = await Category.findAllCategories();
        const categories = new Map<number, string>();
        for (const category of categoryRow) {
          categories.set(category.id, category.type);
        }
        const algoliaProduct = {
          ...product,
          categoryName: categories.get(product.categoryId) || 'Okänd kategori',
        };
        await indexProducts([algoliaProduct]);
      } else {
        await removeProducts([product.productId.toString()]);
      }
      res.json({ success: true, searchIndexed: true, data: product });
    } catch (error) {
      console.warn('Error while indexing product to Algolia:', error);
      res.json({ success: true, searchIndexed: false, message: 'Produkten uppdaterades men misslyckades att indexera till Algolia', data: product });
    }
  } catch (error) {
    console.error('Error while updating product:', error);
    res.status(500).json({ success: false, error: 'Misslyckades att uppdatera produkt'})
  }
};

export const deleteProduct = async ( 
  req: Request<{ id: string }>, res: Response
) => {
  try {
    const productId = Number(req.params.id);

    if (Number.isNaN(productId)) {
      return res.status(400).json({ success: false, error: 'Ogiltigt produkt-ID' });
    }
    const deletedProduct = await Product.delete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, error: 'Produkten hittades ej' });
    }

    try {
      await removeProducts([productId.toString()]);
      res.json({ success: true, searchIndexed: true, message: 'Produkten raderad', data: deletedProduct });
    } catch (error) {
      console.warn('Error while deleting product in Algolia:', error);
      res.json({ success: true, searchIndexed: false, message: 'Produkten raderades men misslyckades att tas bort från Algolia', data: deletedProduct });
    }
  } catch (error) {
    console.error('Error while deleting product', error);
    res.status(500).json({ success: false, error: 'Misslyckades att radera produkt' });
  }
};

export const importProducts = async (
  req: Request<{format: string}>, res: Response
) => {
  const format = req.params.format;
  if (format !== 'csv' && format !== 'xml') {
    return res.status(400).json({ success: false, error: 'Ogiltigt format. Endast csv och xml stöds.' });
  }
  try { 
    const candidates = await getSupplierCatalog(format);

    const categories = await Category.findAllCategories();

    const categoryIds = new Map<string, number>();

    for (const category of categories) {
      categoryIds.set(category.type, category.id);
    }

    let searchIndexed = true;
    let created = 0;
    let updated = 0;
    const skipped: { sku: string, reason: string }[] = [];
    const products: AlgoliaProduct[] = [];

    for (const candidate of candidates) {
      const result = ImportedProduct.safeParse(candidate);
      if (!result.success) {
        skipped.push({ sku: candidate.sku ?? 'saknas', reason: result.error.issues.map((i) => i.message).join(', ') });
        continue;
      }
      const categoryId = categoryIds.get(result.data.category);
      if (!categoryId) {
        skipped.push({ sku: candidate.sku ?? 'saknas', reason: `Kategori "${result.data.category}" saknas i systemet` });
        continue;
      }

      const existed = await Product.findBySku(result.data.sku);
      const product = await Product.upsertBySku(result.data, categoryId);

      if (product.isAvailable === true && product.isDeleted === false) {
        products.push({
          productId: product.productId,
          productName: product.productName,
          categoryName: result.data.category,
          price: product.price,
          inStock: product.inStock,
          imgUrl: product.imgUrl,
          desc: product.desc,
          attributes: product.attributes,
        });
      }


      if (existed) updated++;
      else created++;
    }

    if (products.length > 0) {
      try {
        await indexProducts(products);
      } catch (error) {
        console.warn('Error while indexing products to Algolia:', error);
        searchIndexed = false;
      }
    }

    return res.json({ success: true, data: { format, total: candidates.length, created, updated, skipped, searchIndexed } });

  } catch (error) {
    console.error('Error while importing products:', error);
    res.status(502).json({ success: false, error: 'Misslyckades att importera produkter' });
  }
};

export const indexProductsToAlgolia = async (req: Request, res: Response) => {
  try {
    const products = await UserProduct.findAllUser();

    const indexed = await indexProducts(products);
    res.json({ success: true, data: { indexed } });
  } catch (error) {
    console.error('Error while indexing products to Algolia:', error);
    res.status(502).json({ success: false, error: 'Misslyckades att indexera produkter till Algolia' });
  }
};