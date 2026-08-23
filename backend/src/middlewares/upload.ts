import multer from 'multer';
import { UploadApiResponse } from 'cloudinary';
import streamifier from 'streamifier';
import cloudinary from '../config/cloudinary';

export const upload = multer({ storage: multer.memoryStorage() });

export const uploadToCloudinary = (buffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'tea-garden' },
      (error, result) => error ? reject(error) : resolve(result as UploadApiResponse)
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};