export interface Product {
  id: number;
  title: string;
  description: string;
  status: 'archive' | 'active';
  image: string;
  price: number;
}
