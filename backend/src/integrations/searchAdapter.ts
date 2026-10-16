import { algoliasearch } from 'algoliasearch';

const APP_ID = process.env.ALGOLIA_APP_ID ?? '';
const ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY ?? '';
const SEARCH_KEY = process.env.ALGOLIA_SEARCH_KEY ?? '';
const INDEX_NAME = process.env.ALGOLIA_INDEX ?? 'walkthrough_products';

const adminClient = algoliasearch(APP_ID, ADMIN_KEY);

type AlgoliaRecord = {
  objectID: string;
  productName: string;
  categoryName?: string;
  price: number;
  inStock: number;
  imgUrl: string | null;
  desc: string | null;
  attributes: Record<string, any> | null;
}

export interface AlgoliaProduct {
  productId: number;
  productName: string;
  categoryName?: string;
  price: number;
  inStock: number;
  imgUrl: string | null;
  desc: string | null;
  attributes: Record<string, any> | null;
}

export const indexProducts = async (products: AlgoliaProduct[]) => {
  const records: AlgoliaRecord[] = [];
  for (const product of products) {
    records.push({
      objectID: product.productId.toString(),
      productName: product.productName,
      price: product.price,
      inStock: product.inStock,
      categoryName: product.categoryName,
      imgUrl: product.imgUrl,
      desc: product.desc,
      attributes: product.attributes,
    });
  }

  await adminClient.saveObjects({indexName: INDEX_NAME, objects: records, waitForTasks: true});
  return records.length;
};