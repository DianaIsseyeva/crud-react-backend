import { Request } from 'express';
import fs from 'fs';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
const uuid = require('uuid');
const config = require('../../config');

class MulterService {
  MAGIC_NUMBERS = {
    jpg: 'ffd8ffe0',
    jpg1: 'ffd8ffe1',
    png: '89504e47',
    gif: '47494638',
  };

  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, uuid.v4() + path.extname(file.originalname));
    },
  });

  upload = multer({
    storage: this.storage,
    limits: {
      files: 5,
      fieldSize: 2 * 1024 * 1024,
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
      this.fileFilter(req, file, cb);
    },
  });

  checkMagicNumbers(magic: string): boolean {
    return Object.values(this.MAGIC_NUMBERS).includes(magic);
  }

  checkMagic(files: Express.Multer.File[]): string[] {
    const images = files.map(file => file.filename);
    images.forEach(image => {
      const bitmap = fs.readFileSync(path.join(config.uploadPath, image)).toString('hex', 0, 4);
      if (!this.checkMagicNumbers(bitmap)) {
        fs.unlinkSync(path.join(config.uploadPath, image));
        throw new Error(`File ${path.join(config.uploadPath, image)} is not a valid`);
      }
    });
    return images;
  }

  fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type') as unknown as null, false);
    }
  }
}

export default new MulterService();
