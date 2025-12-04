import api from '@/lib/api';

export type ProductCategory = 'pomade' | 'wax' | 'gel' | 'beard_oil' | 'shampoo' | 'conditioner' | 'styling' | 'accessories' | 'other';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Product {
  id: string;
  barberId: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  images: string[];
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export interface ProductWithBarber extends Product {
  barberName: string;
  barberImage?: string;
}

export interface ProductOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: OrderStatus;
  shippingAddress?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductStats {
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
  reviewCount: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export const productService = {
  // Barber endpoints
  create: async (data: Omit<Product, 'id' | 'barberId' | 'createdAt'>): Promise<Product> => {
    return api.post<Product>('/products', data);
  },

  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    return api.put<Product>(`/products/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return api.delete(`/products/${id}`);
  },

  getMyProducts: async (): Promise<Product[]> => {
    return api.get<Product[]>('/products/my');
  },

  updateStock: async (id: string, stock: number): Promise<Product> => {
    return api.put<Product>(`/products/${id}/stock`, { stock });
  },

  getMyStats: async (): Promise<ProductStats> => {
    return api.get<ProductStats>('/products/my/stats');
  },

  // Order management (barber)
  getBarberOrders: async (): Promise<ProductOrder[]> => {
    return api.get<ProductOrder[]>('/products/orders/barber');
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<ProductOrder> => {
    return api.put<ProductOrder>(`/products/orders/${orderId}/status/${status}`);
  },

  // Public/Customer endpoints
  getBarberProducts: async (barberId: string): Promise<Product[]> => {
    return api.get<Product[]>(`/products/barber/${barberId}`);
  },

  getProduct: async (id: string): Promise<ProductWithBarber> => {
    return api.get<ProductWithBarber>(`/products/${id}`);
  },

  getProductReviews: async (id: string): Promise<ProductReview[]> => {
    return api.get<ProductReview[]>(`/products/${id}/reviews`);
  },

  createOrder: async (items: CartItem[], shippingAddress: string): Promise<{ order: ProductOrder; paymentUrl: string }> => {
    return api.post('/products/orders', { items, shippingAddress });
  },

  getMyOrders: async (): Promise<ProductOrder[]> => {
    return api.get<ProductOrder[]>('/products/orders/my');
  },

  getOrder: async (id: string): Promise<ProductOrder> => {
    return api.get<ProductOrder>(`/products/orders/${id}`);
  },

  createReview: async (productId: string, rating: number, comment: string): Promise<ProductReview> => {
    return api.post<ProductReview>('/products/reviews', { productId, rating, comment });
  },
};

export default productService;
