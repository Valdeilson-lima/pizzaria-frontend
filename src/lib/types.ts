export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  message: string;
  user: User & {
    token: string;
  };
}

export interface RegisterResponse {
  message: {
    user: Pick<User, "id" | "name" | "email">;
    message: string;
  };
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  banner: string;
  disabled?: boolean;
  category_id?: string;
  category?: {
    id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  amount: number;
  order_id?: string;
  product_id?: string;
  product: Product;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  table: number;
  name: string | null;
  status: boolean;
  draft: boolean;
  createdAt: string;
  updatedAt?: string;
  orderItems: OrderItem[];
}
