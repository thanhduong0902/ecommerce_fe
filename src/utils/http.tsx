import axios, { AxiosError, type AxiosInstance } from "axios";
import HttpStatusCode from "../constants/httpStatusCode.enum";
import { toast } from "react-toastify";
import { AuthResponse, RefreshTokenReponse } from "../types/auth.type";
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS,
} from "./auth";

import config from "../constants/config";
import {
  URL_LOGIN,
  URL_LOGOUT,
  URL_REFRESH_TOKEN,
  URL_REGISTER,
} from "../apis/auth.api";
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from "./utils";
import { ErrorResponse } from "../types/utils.types";
// API Purchase: 1 - 3 (bắt đầu gọi API từ giây 1 -> giây 3)
// API Me: 2 - 5 (bắt đầu gọi API từ giây 2 -> giây 5)
// API Refresh Token cho API purchase: 3 -  4 (sau khi API Purchase bị lỗi là bắt đầu từ giây 3)
// Gọi lại Purchase: 4 - 6 (sau đó gọi lại Purchase từ giây 4 -> giây 6)
// Refresh Token mới cho API me: 5 - 6 (sau khi Me hết hạn thì nó lỗi. Sau đó nó gọi lại refresh token cho Me. Bắt đầu từ giây 5 -> giây 6)
// Gọi lại Me: 6 (cuối cùng thì nó gọi lại API Me từ giây thứ 6)

export class Http {
  instance: AxiosInstance;
  private accessToken: string;
  private refreshToken: string;
  private refreshTokenRequest: Promise<string> | null;

  constructor() {
    this.accessToken = getAccessTokenFromLS();
    this.refreshToken = getRefreshTokenFromLS();
    this.refreshTokenRequest = null;
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        "expire-access-token": 60 * 60 * 24, // 1 ngày
        "expire-refresh-token": 60 * 60 * 24 * 160, // 160 ngày
      },
    });
    this.instance.interceptors.request.use(
      (config) => {
        console.log(this.accessToken);
        config.headers["Authorization"] = `Bearer ${this.accessToken}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
        if (url === URL_LOGIN || url === URL_REGISTER) {
          const data = response.data;
          this.accessToken = data.token;
          setAccessTokenToLS(this.accessToken);
          setRefreshTokenToLS(this.accessToken);
        } else if (url === URL_LOGOUT) {
          this.accessToken = "";
          this.refreshToken = "";
          clearLS();
        }
        return response;
      },
      (error: AxiosError) => {
        // Chỉ toast lỗi không phải 422 và 401
        if (
          ![
            HttpStatusCode.UnprocessableEntity,
            HttpStatusCode.Unauthorized,
          ].includes(error.response?.status as number)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data;
          const message = data?.message || error.message;
          toast.error(message);
          console.log(message);
        }

        return Promise.reject(error);
      }
    );
  }
}
const http = new Http().instance;
export default http;
