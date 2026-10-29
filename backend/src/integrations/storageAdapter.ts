import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY ?? '';
const BUCKET = process.env.SUPABASE_BUCKET ?? 'product-images';
const TIMEOUT_MS = 10_000;

if (!SUPABASE_URL || !SECRET_KEY) {
  throw new Error('Supabase is not configured. Copy .env.example to .env and fill in SUPABASE_URL and SUPABASE_SECRET_KEY.');
}

const supabase = createClient(SUPABASE_URL, SECRET_KEY, {
  global: {
    fetch: (input, init) => {
      return fetch(input, {...init, signal: AbortSignal.timeout(TIMEOUT_MS)})
    }}
});

type ImageFileType = {
  buffer: Buffer,
  mimeType: string
}

const EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg'
}

export const uploadProductImage = async (image: ImageFileType) => {
  const extension = EXTENSIONS[image.mimeType];
  const path = `products/${randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, image.buffer, {
    contentType: image.mimeType,
    upsert: false
  });

  if (error) {
    throw new Error(`Could not upload the image to supabase: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return { path: path, url: data.publicUrl }
};

export const removeProductImage = async (path: string) => {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    throw new Error(`Could not delete the image in supabase: ${error.message}`);
  }
};