type Role = "User" | "Admin";

export interface User {
  id: string;
  role: string;
  email: string;
  username: string;
  email_verified_at: string; // ISO 8610
  created_at: string;
  updated_at: string;
  phone: string;
  address_id: string;
  id_ban: number;
  name: string;
  order: any;
}
