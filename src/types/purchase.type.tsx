import { Product, Shop } from "./product.type";
import { User } from "./user.type";

export type PurchaseStatus =
  | "WAITE_CONFIRM"
  | "DELIVERING"
  | "CANCELLED"
  | "DELEVERED";

export type PurchaseListStatus = PurchaseStatus | 0;

export interface Purchase {
  id: number;
  dateTimeCreated: string;
  quantity: number;
  product: {
    id: number;
    title: string;
    originalPrice: number;
    sellingPrice: number;
    weight: number;
    rate: number;
    linkImages: string;
    shop: {
      id: number;
      nameShop: string;
      linkImageAvatarShop: string;
    };
  };
}

export interface OrderDetail {
  created_at: string;
  id: number;
  order_id: number;
  price: number;
  product: Product;
  product_id: number;
  quantity: number;
  updated_at: string;
  user_id: number;
}

export interface Order {
  address_id: number;
  amount: number;
  coupon_id: number;
  created_at: string;
  discount: number;
  id: number;
  note: string;
  order_details: OrderDetail[];
  payment_option: string;
  status: string;
  status_pay: string;
  updated_at: string;
  user: User;
  user_id: number;
}

export interface ExtendedPurchase extends Purchase {
  disabled: boolean;
  checked: boolean;
}
