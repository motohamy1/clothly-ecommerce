export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: 'clothing' | 'shoe';
}

export const menClothing: Product[] = [
  { id: 'mc1', name: 'Classic Linen Shirt', price: 49.99, rating: 4.5, image: '/images/products/download (1).png', category: 'clothing' },
  { id: 'mc2', name: 'Slim Fit Chinos', price: 59.99, rating: 4.2, image: '/images/products/download (2).png', category: 'clothing' },
  { id: 'mc3', name: 'Cotton Polo Tee', price: 34.99, rating: 4.7, image: '/images/products/download (3).png', category: 'clothing' },
  { id: 'mc4', name: 'Denim Jacket', price: 89.99, rating: 4.8, image: '/images/products/download (4).png', category: 'clothing' },
  { id: 'mc5', name: 'Relaxed Cargo Pants', price: 54.99, rating: 4.1, image: '/images/products/download (5).png', category: 'clothing' },
  { id: 'mc6', name: 'V-Neck Sweater', price: 44.99, rating: 4.4, image: '/images/products/download (6).png', category: 'clothing' },
];

export const menOuterwear: Product[] = [
  { id: 'mo1', name: 'Puffer Vest', price: 99.99, rating: 4.6, image: '/images/products/download.png', category: 'clothing' },
  { id: 'mo2', name: 'Windbreaker', price: 74.99, rating: 4.3, image: '/images/products/download (1).png', category: 'clothing' },
  { id: 'mo3', name: 'Wool Overcoat', price: 149.99, rating: 4.9, image: '/images/products/download (2).png', category: 'clothing' },
  { id: 'mo4', name: 'Bomber Jacket', price: 89.99, rating: 4.5, image: '/images/products/download (3).png', category: 'clothing' },
  { id: 'mo5', name: 'Rain Parka', price: 69.99, rating: 4.2, image: '/images/products/download (4).png', category: 'clothing' },
];

export const menShoes: Product[] = [
  { id: 'ms1', name: 'Canvas Sneakers', price: 64.99, rating: 4.4, image: '/images/products/download (5).png', category: 'shoe' },
  { id: 'ms2', name: 'Leather Loafers', price: 89.99, rating: 4.7, image: '/images/products/download (6).png', category: 'shoe' },
  { id: 'ms3', name: 'Running Trainers', price: 79.99, rating: 4.6, image: '/images/products/download.png', category: 'shoe' },
  { id: 'ms4', name: 'Suede Boots', price: 119.99, rating: 4.8, image: '/images/products/download (1).png', category: 'shoe' },
  { id: 'ms5', name: 'Slip-on Sandals', price: 39.99, rating: 4.1, image: '/images/products/download (2).png', category: 'shoe' },
  { id: 'ms6', name: 'High-top Trainers', price: 74.99, rating: 4.5, image: '/images/products/download (3).png', category: 'shoe' },
];
