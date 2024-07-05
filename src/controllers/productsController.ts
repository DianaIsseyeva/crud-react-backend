import express from 'express';
import { productsMock as initialProducts } from '../productsMock';
import { Product } from '../types';

const router = express.Router();

let products: Product[] = [...initialProducts];

router.get('/products', (req, res) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedProducts = products.slice(startIndex, endIndex);
  res.json({
    page,
    limit,
    total: products.length,
    totalPages: Math.ceil(products.length / limit),
    products: paginatedProducts,
  });
});

router.post('/products', (req, res) => {
  const newProduct: Product = {
    id: products.length + 1,
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    image: req.body.image,
    price: req.body.price,
  };
  products.push(newProduct);
  res.json(newProduct);
});

router.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const productIndex = products.findIndex(product => product.id === id);
  if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], ...req.body };
    res.json(products[productIndex]);
  } else {
    res.status(404).send({ message: 'Product not found' });
  }
});

router.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  products = products.filter(product => product.id !== id);
  res.status(204).send();
});

export default router;
