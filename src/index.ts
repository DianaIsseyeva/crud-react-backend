import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import productsController from './controllers/productsController';
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(productsController);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
