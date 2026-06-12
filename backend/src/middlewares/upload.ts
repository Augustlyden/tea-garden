import multer from 'multer';
import path from 'path';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public/uploads'));
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const fileName = crypto.randomUUID();
    cb(null, fileName + extension);
  }
});

export const upload = multer({ storage: storage})