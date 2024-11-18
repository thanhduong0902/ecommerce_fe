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
import { Item } from "../../types/product.type";

export default function Cart() {
  const navigate = useNavigate();
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext);
  //   const { data: purchasesInCartData, refetch } = useQuery({
  //     queryKey: ["purchases"],
  //     queryFn: () => purchaseApi.getPurchases(),
  //   });

  const { cart, setCart } = useContext(AppContext);
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
  const totalCheckedPurchasePrice = useMemo(
    () =>
      cart.reduce((result, current) => {
        return result + current.price * current.quantity;
      }, 0),
    [cart]
  );
  //   const totalCheckedPurchaseSavingPrice = useMemo(
  //     () =>
  //       checkedPurchases.reduce((result, current) => {
  //         return (
  //           result +
  //           (current.price - current.product.sellingPrice) *
  //             current.quantity
  //         );
  //       }, 0),
  //     [checkedPurchases]
  //   );

  //   useEffect(() => {
  //     setExtendedPurchases((prev) => {
  //       const extendedPurchasesObject = keyBy(prev, "_id");
  //       return (
  //         cart?.map((purchase) => {
  //           const isChoosenPurchaseFromLocation =
  //             choosenPurchaseIdFromLocation === purchase.product_id;
  //           return {
  //             ...purchase,
  //             disabled: false,
  //             checked:
  //               isChoosenPurchaseFromLocation ||
  //               Boolean(extendedPurchasesObject[purchase.product_id]?.checked),
  //           };
  //         }) || []
  //       );
  //     });
  //   }, [cart, choosenPurchaseIdFromLocation]);

  //   useEffect(() => {
  //       return () => {
  //           history.replaceState(null, '')
  //       }
  //   }, [])

  const handleCheck =
    (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedPurchases = [...extendedPurchases]; // Tạo một bản sao của mảng extendedPurchases

      // Cập nhật thuộc tính checked cho sản phẩm tại vị trí purchaseIndex
      updatedPurchases[purchaseIndex].checked = event.target.checked;

      // Set state mới cho extendedPurchases
      setExtendedPurchases(updatedPurchases);
    };

  const handleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked,
      }))
    );
  };

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {};

  const handleQuantity = (
    purchaseIndex: number,
    value: number,
    enable: boolean
  ) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex];
      //   setExtendedPurchases(
      //     {

      //     }
      //   )
      updatePurchaseMutation.mutate({ cartId: purchase.id, quantity: value });
    }
  };

  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex].id;
    deletePurchasesMutation.mutate(purchaseId);
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
  const url = "https://pushimage-production.up.railway.app/api/auth/image/";

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
                    {cart.map((purchase: Item, index) => (
                      <div
                        key={purchase.product_id}
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
                                {/* <span className="text-gray-300 line-through">
                                  ₫
                                  {formatCurrency(
                                    purchase.
                                  )}
                                </span> */}
                                <span className="ml-3">
                                  ₫{formatCurrency(purchase.price)}
                                </span>
                              </div>
                            </div>
                            <div className="col-span-1">
                              <QuantityController
                                max={100}
                                value={purchase.quantity}
                                classNameWrapper="flex items-center"
                                onIncrease={(value) =>
                                  handleQuantity(index, value, value >= 1)
                                }
                                onDecrease={(value) =>
                                  handleQuantity(index, value, value >= 1)
                                }
                                onType={handleTypeQuantity(index)}
                                onFocusOut={(value) =>
                                  handleQuantity(
                                    index,
                                    value,
                                    value >= 1 &&
                                      value <= purchase.quantity &&
                                      value !== cart[index].quantity
                                  )
                                }
                                disabled={false}
                              />
                            </div>
                            <div className="col-span-1">
                              <span className="text-orange">
                                ₫
                                {formatCurrency(
                                  purchase.price * purchase.quantity
                                )}
                              </span>
                            </div>
                            <div className="col-span-1">
                              <button
                                onClick={handleDelete(index)}
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
                to={path.home}
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
