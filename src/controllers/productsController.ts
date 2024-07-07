import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import express from 'express';
import MulterService from '../services/multerService';
import { Product } from '../types';

const router = express.Router();
const productsFilePath = path.join(__dirname, '../productsMock.json');
const assetsPath = path.join(__dirname, '../src/assets');

let products: Product[] = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const saveProductsToFile = () => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

const getNextId = () => {
  const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
  return maxId + 1;
};

router.use(bodyParser.json());

router.get('/products', (req, res) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedProducts = products.slice(startIndex, endIndex);
  res.status(200).json({
    page,
    limit,
    total: products.length,
    totalPages: Math.ceil(products.length / limit),
    products: paginatedProducts,
  });
});

router.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = products.find(p => p.id === id);

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

router.post('/products', MulterService.upload.array('images', 10), (req, res, next) => {
  try {
    const { title, description, status, price } = req.body;
    const files = req.files as Express.Multer.File[];
    const imageFiles = MulterService.checkMagic(files).map(fileName => `http://localhost:8000/assets/${fileName}`);

    const newProduct: Product = {
      id: getNextId(),
      title,
      description,
      status,
      image: imageFiles.join(','),
      price: parseFloat(price),
    };

    products.push(newProduct);
    saveProductsToFile();
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

router.put('/products/:id', MulterService.upload.array('images', 10), (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const productIndex = products.findIndex(product => product.id === id);
    if (productIndex !== -1) {
      const { title, description, status, price } = req.body;
      const files = req.files as Express.Multer.File[];
      const imageFiles =
        files.length > 0
          ? MulterService.checkMagic(files).map(fileName => `http://localhost:8000/assets/${fileName}`)
          : [];

      const oldImages = products[productIndex].image.split(',');

      products[productIndex] = {
        ...products[productIndex],
        title,
        description,
        status,
        price: parseFloat(price),
        image: imageFiles.length > 0 ? imageFiles.join(',') : products[productIndex].image,
      };
      saveProductsToFile();

      if (imageFiles.length > 0) {
        oldImages.forEach(image => {
          const imagePath = path.join(assetsPath, path.basename(new URL(image).pathname));
          fs.unlink(imagePath, err => {
            if (err) console.error(`Failed to delete old image: ${imagePath}`, err);
          });
        });
      }

      res.status(200).json(products[productIndex]);
    } else {
      res.status(404).send({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  products = products.filter(product => product.id !== id);
  saveProductsToFile();
  res.status(204).send();
});

export default router;
