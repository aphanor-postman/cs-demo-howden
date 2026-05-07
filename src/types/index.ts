export interface NewProduct {
  name: string;
  description: string;
  model: string;
  sku: string;
  cost: number;
  imageUrl: string;
}

export interface ViewProduct extends NewProduct {
  id: string;
}

export type OrderStatus = 'OPEN' | 'PAID' | 'SHIPPED' | 'RECEIVED';

export interface NewOrder {
  status: OrderStatus;
  date: string;
  productIds: string[];
  cost: number;
  tax: number;
  taxRate: number;
  total: number;
}

export interface ViewOrder extends NewOrder {
  id: string;
}

export interface ApiError {
  status: string;
  message?: string;
}
