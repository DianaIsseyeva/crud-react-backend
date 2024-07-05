import cors from 'cors';
import express from 'express';
import path from 'path';
import productsController from './controllers/productsController';

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(productsController);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
