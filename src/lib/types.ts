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
