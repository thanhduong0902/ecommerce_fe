import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
// Không có tính năng tree-shaking
// import { omit } from 'lodash'

// Import chỉ mỗi function omit
import omit from "lodash/omit";

import { schema, Schema } from "../../utils/rules";
import Input from "../../components/Input";
import authApi from "../../apis/auth.api";
import { isAxiosUnprocessableEntityError } from "../../utils/utils";
import { ErrorResponse } from "../../types/utils.types";
import { useContext } from "react";
import { AppContext } from "../../context/app.context";
import Button from "../../components/Button";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";

type FormData = Pick<
  Schema,
  "name" | "email" | "username" | "password" | "confirm_password" | "phone"
>;
const registerSchema = schema.pick([
  "email",
  "username",
  "password",
  "confirm_password",
  "name",
  "phone",
]);

export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    // resolver: yupResolver(registerSchema)
  });
  const registerAccountMutation = useMutation({
    mutationFn: (body: any) => authApi.registerAccount(body),
  });
  const onSubmit = handleSubmit((data) => {
    const body = {
      email: data.email,
      username: data.username,
      password: data.password,
      phone: data.phone,
      name: data.name,
      password_confirmation: data.confirm_password,
    };
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        toast.success("Đăng ký thành công", {
          position: "top-center",
          autoClose: 1000,
        });
        navigate("/login");
      },
      onError: (error) => {
        console.log("error", error);
        toast.error(`Email hoặc tài khoản đã tồn tại`, {
          position: "top-center",
          autoClose: 1000,
        });
      },
    });
  });

  return (
    <div className="bg-orange">
      <Helmet>
        <title>Đăng ký | Shopee Clone</title>
        <meta
          name="description"
          content="Đăng ký tài khoản vào dự án Shopee Clone"
        />
      </Helmet>
      <div className="container">
        <div className="grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10">
          <div className="lg:col-span-2 lg:col-start-4">
            <form
              className="rounded bg-white p-10 shadow-sm rounded-3xl"
              onSubmit={onSubmit}
              noValidate
            >
              <div className="text-2xl">Đăng ký</div>
              <Input
                name="email"
                register={register}
                className="mt-2"
                type="input"
                classNameEye="absolute right-[5px] h-5 w-5 cursor-pointer "
                errorMessage={errors.email?.message}
                placeholder="Email"
                autoComplete="on"
              />
              <Input
                name="phone"
                register={register}
                type="input"
                className="mt-2"
                errorMessage={errors.phone?.message}
                placeholder="Số điện thoại"
              />
              <Input
                name="name"
                register={register}
                type="input"
                className="mt-2"
                errorMessage={errors.name?.message}
                placeholder="Tên hiển thị"
              />

              <Input
                name="password"
                register={register}
                type="password"
                className="mt-2"
                classNameEye="absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]"
                errorMessage={errors.password?.message}
                placeholder="Mật khẩu"
                autoComplete="on"
              />
              <Input
                name="confirm_password"
                register={register}
                type="password"
                className="mt-2"
                classNameEye="absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]"
                errorMessage={errors.confirm_password?.message}
                placeholder="Nhập lại mật khẩu"
                autoComplete="on"
              />

              <div className="mt-2">
                <Button
                  className="flex rounded-3xl  w-full items-center justify-center bg-orange px-2 py-4 text-sm uppercase text-white hover:bg-red"
                  isLoading={registerAccountMutation.isPending}
                  disabled={registerAccountMutation.isPending}
                >
                  Đăng ký
                </Button>
              </div>
              <div className="mt-8 flex items-center justify-center">
                <span className="text-gray-400">Bạn đã có tài khoản?</span>
                <Link className="ml-1 text-red-400" to="/login">
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
