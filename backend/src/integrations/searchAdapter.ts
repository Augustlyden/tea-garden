import { algoliasearch, BatchResponse } from 'algoliasearch';
import { success } from 'zod';

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

export const removeProducts = async (ids: string[]) => {
  await adminClient.deleteObjects({
    indexName: INDEX_NAME,
    objectIDs: ids,
    waitForTasks: true
  });
};

const searchClient = algoliasearch(APP_ID, SEARCH_KEY);

type SearchParams = {
  query: string,
  page: number,
  pageSize: number
}

export const searchProducts = async (params: SearchParams) => {
  const response = await searchClient.searchSingleIndex<AlgoliaRecord>({ 
    indexName: INDEX_NAME, 
    searchParams: {
      query: params.query,
      page: params.page - 1, 
      hitsPerPage: params.pageSize
    }
  });
  
  const products: AlgoliaProduct[] = [];
  for (const hit of response.hits) {
    products.push({
      productId: Number(hit.objectID),
      productName: hit.productName,
      categoryName: hit.categoryName,
      price: hit.price,
      inStock: hit.inStock,
      desc: hit.desc,
      imgUrl: hit.imgUrl,
      attributes: hit.attributes
    });
  }

  const total = response.nbHits ?? 0
  return {
    products, meta: { page: params.page, pageSize: params.pageSize, total: total, totalPages: Math.ceil(total/params.pageSize) }
  };
};