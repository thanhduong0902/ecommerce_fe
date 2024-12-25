import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useMemo } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router-dom";
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
import { Item, Product } from "../../types/product.type";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../../redux/slices/CartSlice";

export default function Cart() {
  const navigate = useNavigate();
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext);
  //   const { data: purchasesInCartData, refetch } = useQuery({
  //     queryKey: ["purchases"],
  //     queryFn: () => purchaseApi.getPurchases(),
  //   });
  const cart = useSelector((state: RootState) => state.cart.cart);

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      //   refetch();
    },
  });
  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    // onSuccess: (data) => {
    //     refetch()
    //     toast.success(data.data.message, {
    //         position: 'top-center',
    //         autoClose: 1000
    //     })
    // }
  });
  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {},
  });

  const location = useLocation();
  const choosenPurchaseIdFromLocation = (
    location.state as { purchaseId: number } | null
  )?.purchaseId;
  const isAllChecked = useMemo(
    () => extendedPurchases.every((purchase) => purchase.checked),
    [extendedPurchases]
  );
  const checkedPurchases = useMemo(() => cart, [cart]);
  const checkedPurchasesCount = cart.length;
  const totalCheckedPurchasePrice = useMemo(() => {
    return cart.reduce((result: number, current: Product) => {
      return result + current.selling_price * current.quantity;
    }, 0);
  }, [cart]);

  const dispatch = useDispatch();

  // Hàm xử lý tăng số lượng
  const handleIncrease = (productId: number) => {
    dispatch(increaseQuantity(productId)); // Dispatch action tăng số lượng
  };

  // Hàm xử lý giảm số lượng
  const handleDecrease = (productId: number) => {
    dispatch(decreaseQuantity(productId)); // Dispatch action giảm số lượng
  };

  const handleDelete = (productId: number) => () => {
    dispatch(removeFromCart(productId));
  };

  //   const handleBuyPurchases = () => {
  //     if (checkedPurchases.length > 0) {
  //       const body = checkedPurchases.map(
  //         ({ checked, disabled, ...purchase }) => ({
  //           ...purchase,
  //         })
  //       );
  //       buyProductsMutation.mutate(body, {
  //         onSuccess: (response) => {
  //           console.log(response);
  //           navigate("/checkout", {
  //             state: {
  //               data: response.data,
  //             },
  //           });
  //         },
  //       });
  //     }
  //     navigate('/checkout')
  //   };
  const url = "http://127.0.0.1:8081/api/auth/image/";

  return (
    <div className="bg-neutral-100 py-16">
      <div className="container">
        {cart.length > 0 ? (
          <>
            <div className="overflow-auto">
              <div className="min-w-[1000px]">
                <div className="grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow">
                  <div className="col-span-6">
                    <div className="flex items-center">
                      <div className="flex flex-shrink-0 items-center justify-center pr-3">
                        {/* <input
                          type="checkbox"
                          className="h-5 w-5 accent-orange"
                          checked={isAllChecked}
                          onChange={handleCheckAll}
                        /> */}
                      </div>
                      <div className="flex-grow text-black">Sản phẩm</div>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className="grid grid-cols-5 text-center">
                      <div className="col-span-2">Đơn giá</div>
                      <div className="col-span-1">Số lượng</div>
                      <div className="col-span-1">Số tiền</div>
                      <div className="col-span-1">Thao tác</div>
                    </div>
                  </div>
                </div>
                {cart.length > 0 && (
                  <div className="my-3 rounded-sm bg-white p-5 shadow">
                    {cart.map((purchase: Product, index: number) => (
                      <div
                        key={purchase.id}
                        className="mb-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white px-4 py-5 text-center text-sm text-gray-500 first:mt-0"
                      >
                        <div className="col-span-6">
                          <div className="flex">
                            <div className="flex flex-shrink-0 items-center justify-center pr-3">
                              {/* <input
                                type="checkbox"
                                className="h-5 w-5 accent-orange"
                                checked={true}
                                onChange={handleCheck(index)}
                              /> */}
                            </div>
                            <div className="flex-grow">
                              <div className="flex">
                                <Link
                                  className="h-20 w-20 flex-shrink-0"
                                  to={`${path.home}${generateNameId({
                                    name: purchase.title,
                                    id: purchase.id,
                                  })}`}
                                >
                                  <img
                                    className="h-20 w-20"
                                    alt={purchase.title}
                                    src={`${url + purchase.main_image}`}
                                  />
                                </Link>
                                <div className="flex-grow px-2 pb-2 pt-1">
                                  <Link
                                    to={`${path.home}${generateNameId({
                                      name: purchase.title,
                                      id: purchase.id,
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
                                {/* <span className="text-gray-300 line-through">
                                  ₫
                                  {formatCurrency(
                                    purchase.
                                  )}
                                </span> */}
                                <span className="ml-3">
                                  ₫{formatCurrency(purchase.selling_price)}
                                </span>
                              </div>
                            </div>
                            <div className="col-span-1">
                              <QuantityController
                                max={100}
                                value={purchase.quantity}
                                classNameWrapper="flex items-center"
                                onIncrease={() => handleIncrease(purchase.id)} // Gọi khi tăng
                                onDecrease={() => handleDecrease(purchase.id)} // Gọi khi giảm
                                disabled={false}
                              />
                            </div>
                            <div className="col-span-1">
                              <span className="text-orange">
                                ₫
                                {formatCurrency(
                                  purchase.selling_price * purchase.quantity
                                )}
                              </span>
                            </div>
                            <div className="col-span-1">
                              <button
                                onClick={handleDelete(purchase.id)}
                                className="bg-none text-black transition-colors hover:text-orange"
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center">
              <div className="flex items-center">
                <div className="flex flex-shrink-0 items-center justify-center pr-3">
                  {/* <input
                    type="checkbox"
                    className="h-5 w-5 accent-orange"
                    checked={isAllChecked}
                    onChange={handleCheckAll}
                  /> */}
                </div>
                {/* <button
                  className="mx-3 border-none bg-none"
                  onClick={handleCheckAll}
                >
                  Chọn tất cả ({extendedPurchases.length})
                </button> */}
                {/* <button
                  className="mx-3 border-none bg-none"
                  onClick={handleDeleteManyPurchases}
                >
                  Xóa
                </button> */}
              </div>

              <div className="mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center sm:justify-end">
                    <div>
                      Tổng thanh toán ({checkedPurchasesCount} sản phẩm):
                    </div>
                    <div className="ml-2 text-2xl text-orange">
                      ₫{formatCurrency(totalCheckedPurchasePrice)}
                    </div>
                  </div>
                  {/* <div className="flex items-center text-sm sm:justify-end">
                    <div className="text-gray-500">Tiết kiệm</div>
                    <div className="ml-6 text-orange">
                      ₫{formatCurrency(totalCheckedPurchaseSavingPrice)}
                    </div>
                  </div> */}
                </div>
                <Button
                  className=" rounded-3xl mt-5 flex h-10 w-52 items-center justify-center bg-orange text-sm uppercase text-white hover:bg-red-600 sm:ml-4 sm:mt-0"
                  onClick={() => navigate(path.checkout)}
                  //   disabled={buyProductsMutation.isPending}
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <img
              src={"/assets/no-product.png"}
              alt="no purchase"
              className="mx-auto h-24 w-24"
            />
            <div className="mt-5 font-bold text-gray-400">
              Giỏ hàng của bạn còn trống
            </div>
            <div className="mt-5 text-center">
              <Link
                to={path.product}
                className="rounded-sm bg-orange px-10 py-2 uppercase text-white transition-all hover:bg-orange/80"
              >
                Mua ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
