import { parse } from 'csv-parse/sync';
import { XMLParser } from 'fast-xml-parser';
import { SyntaxValidator } from 'fast-xml-validator';

const BASE_URL = process.env.SUPPLIER_API_URL;
const API_KEY = process.env.SUPPLIER_API_KEY ?? '';
const TIMEOUT_MS = Number(process.env.SUPPLIER_API_TIMEOUT_MS ?? 5000);
const BRANSCH = process.env.SUPPLIER_BRANSCH;

export type CatalogFormat = 'csv' | 'xml';

export type ProductCandidate = {
  sku: string | undefined;
  productName: string | undefined;
  category: string | undefined;
  price: number;
  inStock: number | undefined;
  desc: string | undefined;
  attributes: Record<string, any> | undefined;
};

type CsvRow = {
  artNr: string;
  ean: string;
  benamning: string;
  pris: string;
  lagersaldo: string;
  varianter: string;
  kategori: string;
}

type XmlProduct = {
  '@_artNr': string;
  ean: string;
  benamning: string;
  pris?: { '#text': string };
  lagersaldo: string;
  varianter?: { variant: string[] }; 
  kategori: string;
}

function parseDecimal(value: unknown): number {
  const text = String(value ?? '').replace(/\s/g, '').replace(',', '.');
  return text === '' ? NaN : Number(text);
}

function parseCsvCatalog(buffer: Buffer): ProductCandidate[] {
  const text = new TextDecoder('windows-1252').decode(buffer);

  const rows = parse<CsvRow>(text, {
    columns: true,
    delimiter: ';',
    skip_empty_lines: true,
    trim: true,
    bom: true
  });

  const products: ProductCandidate[] = rows.map((row) => ({
    sku: row.artNr,
    productName: row.benamning,
    price: parseDecimal(row.pris),
    inStock: row.lagersaldo === '' ? 0 : parseDecimal(row.lagersaldo),
    attributes: row.varianter ? { variants: row.varianter.split('|') } : undefined,
    desc: undefined,
    category: row.kategori
  }));
 
  return products;
}

const xmlParser = new XMLParser({
  ignoreAttributes: false, 
  parseTagValue: false,
  isArray: (name) => name === 'produkt' || name === 'variant',
});

function parseXmlCatalog(buffer: Buffer): ProductCandidate[] {
  const text = new TextDecoder('utf-8').decode(buffer);
  const result = SyntaxValidator.validate(text);
  if (result !== true) {
    throw new Error(`Invalid XML from supplier:`, { cause: result });
  }
  const doc: { katalog: { produkt: XmlProduct[] } } = xmlParser.parse(text);

  const products: ProductCandidate[] = doc.katalog.produkt.map((p) => ({
    sku: p['@_artNr'],
    productName: p.benamning,
    price: parseDecimal(p.pris?.['#text']),
    inStock: p.lagersaldo === '' ? 0 : parseDecimal(p.lagersaldo),
    attributes: p.varianter?.variant ? { variants: p.varianter.variant } : undefined,
    desc: undefined,
    category: p.kategori
  }));

  return products;
}

export async function getSupplierCatalog(format: CatalogFormat): Promise<ProductCandidate[]> {
  try {
    const response =  await fetch(`${BASE_URL}/export/products.${format}?bransch=${BRANSCH}`, {
      headers: { 'X-Api-Key': API_KEY },
      signal: AbortSignal.timeout(TIMEOUT_MS)
    })

    if (!response.ok) {
      throw new Error('Could not fetch the catalogue file from the supplier', { cause: response.statusText })
    }

    const buffer =  Buffer.from(await response.arrayBuffer());

    switch(format) {
      case 'csv':
        return parseCsvCatalog(buffer)
      case 'xml':
        return parseXmlCatalog(buffer)
    }
  } catch (err) {
    throw new Error('Could not fetch the catalogue file from the supplier', { cause: err });
  }
}