
import { Product, Client } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Arroz Integral 1kg', price: 7.50, category: 'Grãos', image: 'https://picsum.photos/seed/rice/200/200', barcode: '7891000001', stock: 50 },
  { id: '2', name: 'Feijão Carioca 1kg', price: 9.20, category: 'Grãos', image: 'https://picsum.photos/seed/beans/200/200', barcode: '7891000002', stock: 35 },
  { id: '3', name: 'Azeite de Oliva 500ml', price: 34.90, category: 'Óleos', image: 'https://picsum.photos/seed/olive/200/200', barcode: '7891000003', stock: 20 },
  { id: '4', name: 'Café Torrado 500g', price: 18.00, category: 'Bebidas', image: 'https://picsum.photos/seed/coffee/200/200', barcode: '7891000004', stock: 100 },
  { id: '5', name: 'Leite Integral 1L', price: 4.80, category: 'Laticínios', image: 'https://picsum.photos/seed/milk/200/200', barcode: '7891000005', stock: 120 },
  { id: '6', name: 'Pão de Forma 500g', price: 6.50, category: 'Padaria', image: 'https://picsum.photos/seed/bread/200/200', barcode: '7891000006', stock: 15 },
  { id: '7', name: 'Sabão em Pó 1kg', price: 14.50, category: 'Limpeza', image: 'https://picsum.photos/seed/soap/200/200', barcode: '7891000007', stock: 40 },
  { id: '8', name: 'Papel Higiênico 12un', price: 22.00, category: 'Higiene', image: 'https://picsum.photos/seed/paper/200/200', barcode: '7891000008', stock: 30 },
  { id: '9', name: 'Chocolate 100g', price: 5.90, category: 'Doces', image: 'https://picsum.photos/seed/choco/200/200', barcode: '7891000009', stock: 60 },
  { id: '10', name: 'Detergente 500ml', price: 2.30, category: 'Limpeza', image: 'https://picsum.photos/seed/detergent/200/200', barcode: '7891000010', stock: 80 },
];

export const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Mariana Oliveira', document: '123.456.789-00', email: 'mariana@example.com', phone: '11999998888', address: 'Av. Paulista, 1000, SP' },
  { id: 'c2', name: 'Mercado do Bairro LTDA', document: '12.345.678/0001-90', email: 'contato@mercadobairro.com', phone: '1133334444', address: 'Rua das Flores, 123, RJ' },
];
