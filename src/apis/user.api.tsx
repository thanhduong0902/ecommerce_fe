import { User } from "../types/user.type";
import { SuccessResponse } from "../types/utils.types";
import http from "../utils/http";

interface BodyUpdateProfile
  extends Omit<User, "_id" | "roles" | "createdAt" | "updatedAt" | "email"> {
  password?: string;
  newPassword?: string;
}

export interface Account {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  phone: string;
  role: "admin" | "user"; // nếu có nhiều loại role, có thể thêm vào
  address_id: number | null;
  is_ban: number; // thường dùng boolean thay cho 0 hoặc 1
}
const userApi = {
  getProfile(params: string) {
    return http.get<User>("/v1/user/get", {
      headers: {
        Authorization: "Bearer " + params,
      },
    });
  },
  updateProfile(body: BodyUpdateProfile) {
    return http.put<SuccessResponse<User>>("user", body);
  },
  uploadAvatar(body: FormData) {
    return http.post<SuccessResponse<string>>("user/upload-avatar", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getNotification() {
    return http.get<any>(`/notification/getAll`);
  },
  checkBalance(idCus: number) {
    return http.get<any>(`wallet/checkBalance?idCus=${idCus}`);
  },
  topUpMoney(amount: number) {
    return http.put<any>(`wallet/topUpMoney?amount=${amount}`);
  },
  getUser() {
    return http.get<Account[]>("v1/admin/user/getAll");
  },
};

export default userApi;
