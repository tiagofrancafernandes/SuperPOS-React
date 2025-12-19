
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  barcode: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Client {
  id: string;
  name: string;
  document: string; // CPF or CNPJ
  address?: string;
  email?: string;
  phone?: string;
}

export interface SaleRecord {
  id: string;
  timestamp: number;
  items: CartItem[];
  total: number;
  payments: Array<{ method: string; amount: number }>;
  paymentMethod: string;
}

export enum ViewMode {
  POS = 'pos',
  INVENTORY = 'inventory',
  HISTORY = 'history',
  REPORTS = 'reports',
}

export type PaymentStep = 
  | 'SELECT_METHOD' 
  | 'SET_AMOUNT'
  | 'PIX_QR' 
  | 'CARD_TYPE' 
  | 'CARD_MACHINE' 
  | 'PROCESSING' 
  | 'OFFLINE_TERMINAL'
  | 'SALE_COMPLETE'
  | 'SALE_CANCELLED'
  | 'FISCAL_NOTE'
  | 'CONTACT_INPUT';

export type CardType = 'voucher' | 'credit' | 'debit';

export interface CardMachine {
  id: string;
  name: string;
  status: 'online' | 'offline';
}

export type ContactType = 'email' | 'whatsapp' | 'sms';
