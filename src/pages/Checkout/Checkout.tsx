import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useRoutes } from "react-router-dom";
import purchaseApi from "../../apis/purchase.api";
import Button from "../../components/Button";
import QuantityController from "../../components/QuantityController";
import path from "../../constants/path";
import { purchasesStatus } from "../../constants/purchase";
import { Purchase } from "../../types/purchase.type";
import { formatCurrency, generateNameId } from "../../utils/utils";
import { produce } from "immer";
import keyBy from "lodash/keyBy";
import { toast } from "react-toastify";
import { AppContext } from "../../context/app.context";
import { error } from "console";
import { Item } from "../../types/product.type";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, setCart } = useContext(AppContext);
  // const { data } = location.state;
  const url = "https://pushimage-production.up.railway.app/api/auth/image/";
  const [addressDelivery, setAddressDelivery] = useState({
    city: "",
    district: "",
    ward: "",
    detail: "",
  });

  const [couponId, setCouponId] = useState(0);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setAddressDelivery((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [paymentOption, setPaymentOption] = useState("PAYCASH");
  const [note, setNote] = useState("Can giao hang gap");
  // Hàm xử lý khi chọn phương thức thanh toán
  const handleSelectPayment = (option: any) => {
    setPaymentOption(option);
  };

  const totalAmount = useMemo(() => {
    return cart.reduce(
      (acc: any, item: Item) => acc + item.quantity * item.price + 25000,
      0
    );
  }, [cart]);

  const totalShip = useMemo(() => {
    return cart.reduce((acc: any, item: Item) => acc + 25000, 0);
  }, [cart]);

  const buyPurchaseMutation = useMutation({
    mutationFn: purchaseApi.pay,
    // onSuccess: (data) => {
    //     refetch()
    //     toast.success(data.data.message, {
    //         position: 'top-center',
    //         autoClose: 1000
    //     })
    // }
  });

  const handleBuyPurchases = () => {
    const bodyCart = cart.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    const updatedBody = {
      carts: bodyCart,
      address: {
        detail: "Số 5 Phạm Văn Đồng",
      },
      payment_option: paymentOption,
      user: {
        email: "thanh@gmail.com",
        phone: "0376656186",
        name: "Thanh Dương",
      },
      coupon_id: couponId,
      note: note,
      discount: 0,
      amount: 1,
    };
    buyPurchaseMutation.mutate(updatedBody, {
      onSuccess: (respone) => {
        toast.success("Thành công", {
          position: "top-center",
          autoClose: 1000,
        });
        navigate("/");
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <div className="bg-neutral-100 py-16">
      <div className="container">
        <div className="overflow-auto">
          <div className="min-w-[1000px]">
            <div className="rounded-sm bg-white px-9 py-5 text-sm capitalize shadow">
              <div className="flex items-center mb-3 text-orange">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 mr-2 fill-current"
                  viewBox="0 0 30 30"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 018 8c0 5.596-8 14-8 14S2 15.596 2 10a8 8 0 018-8zm0 3a2 2 0 100 4 2 2 0 000-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-orange-500">Địa chỉ nhận hàng</span>
              </div>
              <div className="flex items-center">
                <div className="sm:col-span-2 sm:col-start-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Tỉnh/Thành phố
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={handleChange}
                      placeholder="Tỉnh/Thành phố"
                      value={addressDelivery.city}
                      type="text"
                      name="city"
                      id="city"
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2 mx-10">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Quận/Huyện
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={handleChange}
                      placeholder="Quận/Huyện"
                      value={addressDelivery.district}
                      type="text"
                      name="district"
                      id="district"
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Phường/Xã
                  </label>
                  <div className="mt-2">
                    <input
                      onChange={handleChange}
                      placeholder="Phường/Xã"
                      value={addressDelivery.ward}
                      type="text"
                      name="ward"
                      id="ward"
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2 mx-10">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Địa chỉ chi tiết
                  </label>
                  <div className="mt-2">
                    <input
                      placeholder="Chi tiết"
                      onChange={handleChange}
                      value={addressDelivery.detail}
                      type="text"
                      name="detail"
                      id="detail"
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <>
          <div className="overflow-auto my-5">
            <div className="min-w-[1000px]">
              <div className="grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow">
                <div className="col-span-6">
                  <div className="flex items-center">
                    <div className="flex-grow text-black">Sản phẩm</div>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="grid grid-cols-5 text-center">
                    <div className="col-span-2">Đơn giá</div>
                    <div className="col-span-1">Số lượng</div>
                    <div className="col-span-1">Số tiền</div>
                    {/* <div className='col-span-1'>Thao tác</div> */}
                  </div>
                </div>
              </div>
              {cart && (
                <div className="my-3 rounded-sm bg-white p-5 shadow">
                  {cart.map((purchase: Item) => (
                    <div
                      key={purchase.product_id}
                      className="mb-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white px-4 py-5 text-center text-sm text-gray-500 first:mt-0"
                    >
                      <div className="col-span-6">
                        <div className="flex">
                          <div className="flex flex-shrink-0 items-center justify-center pr-3">
                            {/* <input
                                                                type='checkbox'
                                                                className='h-5 w-5 accent-orange'
                                                                checked={purchase.checked}
                                                                onChange={handleCheck(index)}
                                                            /> */}
                          </div>
                          <div className="flex-grow">
                            <div className="flex">
                              <Link
                                className="h-20 w-20 flex-shrink-0"
                                to={`${path.home}${generateNameId({
                                  name: purchase.title,
                                  id: purchase.product_id,
                                })}`}
                              >
                                <img
                                  className="h-20 w-20"
                                  alt={purchase.title}
                                  src={`${url + purchase.img}`}
                                />
                              </Link>
                              <div className="flex-grow px-2 pb-2 pt-1">
                                <Link
                                  to={`${path.home}${generateNameId({
                                    name: purchase.title,
                                    id: purchase.product_id,
                                  })}`}
                                  className="text-left line-clamp-2"
                                >
                                  {purchase.title}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-6">
                        <div className="grid grid-cols-5 items-center">
                          <div className="col-span-2">
                            <div className="flex items-center justify-center">
                              <span className="text-gray-300 line-through">
                                ₫{formatCurrency(purchase.price)}
                              </span>
                              <span className="ml-3">
                                ₫{formatCurrency(purchase.price)}
                              </span>
                            </div>
                          </div>
                          <div className="col-span-1">
                            <span>{purchase.quantity}</span>
                          </div>
                          <div className="col-span-1">
                            <span className="text-orange">
                              ₫
                              {formatCurrency(
                                purchase.price * purchase.quantity
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="overflow-auto">
            <div className="min-w-[1000px]">
              <div className="rounded-sm bg-white px-9 py-5 text-sm capitalize shadow">
                <div className="flex items-center mb-3 text-orange justify-between">
                  <span className="text-orange-500">
                    Phương thức thanh toán
                  </span>
                  <div className="flex items-center">
                    <Button
                      className={`rounded-3xl mt-5 flex h-10 w-80 px-5 items-center justify-center bg-orange text-sm uppercase text-white hover:bg-orange-600 sm:ml-4 sm:mt-0`}
                      onClick={() => handleSelectPayment("PAY_CASH")}
                    >
                      Thanh toán khi nhận hàng
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center">
            <div className="flex items-center"></div>

            <div className="mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center sm:justify-end">
                  <div>Phí vận chuyển :</div>
                  <div className="ml-2 text-2xl text-orange">
                    ₫{formatCurrency(totalShip)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center sm:justify-end">
                  <div>Tổng thanh toán</div>
                  <div className="ml-2 text-2xl text-orange">
                    ₫{formatCurrency(totalAmount)}
                  </div>
                </div>
              </div>
              <Button
                className="rounded-3xl mt-5 flex h-10 w-52 items-center justify-center bg-orange text-sm uppercase text-white hover:bg-red-600 sm:ml-4 sm:mt-0"
                onClick={handleBuyPurchases}
                // disabled={buyProductsMutation.isPending}
              >
                Xác nhận
              </Button>
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
