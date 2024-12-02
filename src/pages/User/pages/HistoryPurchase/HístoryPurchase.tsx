import { useMutation, useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { createSearchParams, Link } from "react-router-dom";
import purchaseApi from "../../../../apis/purchase.api";
import path from "../../../../constants/path";
import { purchasesStatus } from "../../../../constants/purchase";
import useQueryParams from "../../../../hooks/useQueryParams";
import {
  Order,
  OrderDetail,
  PurchaseListStatus,
  PurchaseStatus,
} from "../../../../types/purchase.type";
import { formatCurrency, generateNameId } from "../../../../utils/utils";
import { QueryConfig } from "../../../../hooks/useQueryConfig";
import { useContext, useEffect, useState } from "react";
import { Button, Image } from "antd";
import Lottie from "lottie-react";
import loading from "../../../../animation/loading.json";
import { Modal } from "antd";
import { Product } from "../../../../types/product.type";
import productApi from "../../../../apis/product.api";
import { AppContext } from "../../../../context/app.context";
import { toast } from "react-toastify";

const purchaseTabs = [
  { status: purchasesStatus.wait_confirm, name: "Chờ xác nhận" },
  { status: purchasesStatus.delevering, name: "Đang giao" },
  { status: purchasesStatus.delevered, name: "Đã giao" },
  { status: purchasesStatus.canceled, name: "Đã hủy" },
];

export default function HistoryPurchase() {
  const queryParams: { status?: string } = useQueryParams();
  const { profile } = useContext(AppContext);
  const status: string | undefined = queryParams.status;
  const [selectedTab, setSelectedTab] = useState(purchaseTabs[0].status);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenReview, setIsOpenReview] = useState(false);
  const [orderDetail, setOrderDetail] = useState<Order>();

  const [orderReview, setOrderReview] = useState<OrderDetail>();
  const [reviewContent, setReviewContent] = useState("");
  const [rating, setRating] = useState(5);

  const reviewMutation = useMutation({
    mutationFn: productApi.reviewProduct,
  });

  const handleReview = () => {
    const body = {
      star: rating,
      username: profile?.phone,
      content: reviewContent,
      product_id: orderReview?.product.id,
    };
    reviewMutation.mutate(body, {
      onSuccess: (response) => {
        toast.success("Thành công", {
          position: "top-center",
          autoClose: 1000,
        });
        setIsOpenReview(!isOpenReview);
      },
      onError: (errors) => {
        toast(errors.message);
      },
    });
  };

  function closeModal() {
    setIsOpen(false);
  }

  function closeModalReview() {
    setIsOpenReview(false);
  }

  const {
    data: purchasesInCartData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["purchases", { selectedTab }],
    queryFn: () => {
      return purchaseApi.getOrder(selectedTab);
    },
  });
  const purchasesInCart = purchasesInCartData?.data;

  useEffect(() => {
    const firstTab = document.querySelector(".tab-link") as HTMLElement; // Lấy tab đầu tiên
    if (firstTab) {
      firstTab.focus(); // Đặt focus cho tab đầu tiên
    }
  }, []); // Chỉ chạy một lần sau khi component được render

  const handleTabClick = (tabStatus: any) => {
    setSelectedTab(tabStatus); // Lưu trạng thái của tab được chọn
    refetch({ status: tabStatus } as any);

    // Lấy phần tử tab được chọn
    const selectedTabElement = document.querySelector(
      `[data-status="${tabStatus}"]`
    ) as HTMLElement;
    if (selectedTabElement) {
      selectedTabElement.focus(); // Đặt focus vào tab được chọn
    }
  };

  const urlImage =
    "https://pushimage-production.up.railway.app/api/auth/image/";

  const purchaseTabsLink = purchaseTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: path.historyPurchase,
        // search: createSearchParams({
        //     status: String(tab.status)
        // }).toString()
      }}
      onClick={() => handleTabClick(tab.status)}
      className={classNames(
        "tab-link",
        "flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center",
        {
          "border-b-orange text-orange": selectedTab === tab.status, // Tab được chọn
          "border-b-black/10 text-gray-900": selectedTab !== tab.status, // Tab không được chọn
        }
      )}
    >
      {tab.name}
    </Link>
  ));

  return (
    <div>
      {isLoading ? (
        <div className="items-center justify-center flex">
          <Lottie
            animationData={loading}
            style={{ width: "200px", height: "500px" }}
          />
        </div>
      ) : (
        <div className="overflow-x-auto min-h-96">
          <div className="min-w-[700px]">
            <div className="sticky top-0 flex rounded-t-sm shadow-sm">
              {purchaseTabsLink}
            </div>
            {purchasesInCart && purchasesInCart?.data?.length < 1 ? (
              <div className="items-center justify-center flex">
                <Image
                  src="/assets/no-order.webp"
                  // alt="no purchase"
                  style={{ width: "100%", height: "100%" }}
                  preview={false}
                />
              </div>
            ) : (
              <div className="min-w-[700px]">
                {/* Table header */}
                <div className="grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-center text-gray-500 shadow">
                  <div className="col-span-1 text-black">Mã đơn hàng</div>
                  <div className="col-span-2 text-black">Tên khách hàng</div>
                  <div className="col-span-2 text-black">Số điện thoại</div>
                  <div className="col-span-3 text-black">Thao tác</div>
                  <div className="col-span-4 text-black">Số tiền</div>
                </div>
                {/* Table rows */}
                <div>
                  {purchasesInCart?.data?.map((purchase: Order) => (
                    <div
                      onClick={() => {
                        setIsOpen(true);
                        setOrderDetail(purchase);
                      }}
                      key={purchase.id}
                      className=" border-2 p-2 border-gray-200 mx-2 hover:bg-slate-200 cursor-pointer
                grid grid-cols-12 gap-4 items-center justify-center rounded-2xl bg-white px-9 py-4 text-gray-800 shadow-sm mt-2"
                    >
                      {/* Mã đơn hàng */}
                      <div className="col-span-1 truncate text-center">
                        {purchase.id}
                      </div>

                      {/* Tên khách hàng */}
                      <div className="col-span-2 truncate text-center">
                        {purchase.user.name}
                      </div>

                      {/* Số điện thoại */}
                      <div className="col-span-2 truncate text-center">
                        {purchase.user.phone}
                      </div>

                      {/* Thao tác */}
                      <div className="col-span-3 flex flex-col items-center gap-2 text-center">
                        {/* {(selectedTab === "WAIT_CONFIRM" ||
                    selectedTab === "PREPARE_GOODS") && (
                    <>
                      <Button
                        className="rounded-2xl flex h-9 w-32 items-center justify-center bg-green px-5 text-sm text-white hover:bg-green/80"
                        type="button"
                        onClick={() => handleConfirm(purchase.id)}
                      >
                        Xác nhận
                      </Button>
                      <Button
                        className="flex h-9 w-32 items-center justify-center rounded-2xl bg-red px-5 text-sm text-white hover:bg-red/80"
                        type="button"
                      >
                        Từ chối
                      </Button>
                    </>
                  )} */}
                      </div>

                      {/* Số tiền */}
                      <div className="col-span-4 text-right">
                        <div className="mb-2">
                          <span>Tổng tiền sản phẩm:</span>
                          <span className="ml-4 text-orange">
                            ₫{formatCurrency(purchase.amount)}
                          </span>
                        </div>
                        <div className="mb-2">
                          <span>Tổng giá tiền:</span>
                          <span className="ml-4 text-xl text-orange">
                            ₫{formatCurrency(purchase.amount)}
                          </span>
                        </div>
                        <div>
                          <span>Phương thức thanh toán:</span>
                          <span className="ml-4 text-orange">
                            {purchase.payment_option === "PAYCASH"
                              ? "Tiền mặt"
                              : "Ví Điện tử"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <Modal open={isOpen} title="Chi tiết đơn hàng" onCancel={closeModal}>
        <div>
          <div>
            <span>Mã đơn hàng</span>
            <span className="ml-4">#{orderDetail?.id}</span>
          </div>
          <div className="h-0.5 w-full bg-black my-4"></div>
          <div>
            <span>Thời gian giao hàng</span>
            <span className="ml-4">{orderDetail?.updated_at}</span>
          </div>
          <div className="h-0.5 w-full bg-black my-4"></div>
          <div>
            <p>Chi tiết sản phẩm</p>
            {orderDetail?.order_details.map((item: OrderDetail) => (
              <div className="flex flex-row justify-between items-center">
                <Image
                  width={100}
                  height={100}
                  preview={false}
                  src={urlImage + item.product.main_image}
                />
                <div>{item.product.title}</div>
                <div className="flex flex-row items-center">
                  <div className="text-gray-500 line-through">
                    ₫{formatCurrency(item.product.list_price)}
                  </div>
                  <div className="ml-3 text-xl font-medium text-orange">
                    ₫{formatCurrency(item.product.selling_price)}
                  </div>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setIsOpenReview(true);
                      setOrderReview(item);
                    }}
                    type="primary"
                    size="large"
                    style={{
                      height: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      backgroundColor: "#4caf50",
                      borderColor: "#4caf50",
                      color: "#ffffff",
                    }}
                  >
                    Đánh giá
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
      <Modal
        open={isOpenReview}
        title="Đánh giá sản phẩm"
        onCancel={closeModalReview}
        onOk={handleReview}
      >
        <div>
          <div className="flex flex-row justify-start items-center py-2">
            <Image
              width={100}
              height={100}
              preview={false}
              src={urlImage + orderReview?.product.main_image}
            />
            <div>{orderReview?.product.title}</div>
          </div>
          <div>
            <textarea
              className="h-20 orange-border w-full p-2"
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder="Nhập nội dung..."
            />
            <div className="my-10">
              <span className="mr-5 text-orange">Chất lượng sản phẩm </span>
              {[1, 2, 3, 4, 5].map((star, index) => (
                <span
                  key={index}
                  onClick={() => setRating(star)}
                  style={{
                    color: star <= rating ? "gold" : "gray",
                    cursor: "pointer",
                  }}
                >
                  &#9733;
                </span>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
