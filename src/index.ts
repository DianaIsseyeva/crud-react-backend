import cors from 'cors';
import express from 'express';
import { productsMock as initialProducts } from './productsMock';
import { Product } from './types';

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let products: Product[] = [...initialProducts];

app.get('/products', (req, res) => {
  res.json(products);
});

app.post('/products', (req, res) => {
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

app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const productIndex = products.findIndex(product => product.id === id);
  if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], ...req.body };
    res.json(products[productIndex]);
  } else {
    res.status(404).send({ message: 'Product not found' });
  }
});

app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  products = products.filter(product => product.id !== id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
