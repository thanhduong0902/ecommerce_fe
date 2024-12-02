import { Link } from "react-router-dom";
import { purchasesStatus } from "../../../../constants/purchase";
import useQueryParams from "../../../../hooks/useQueryParams";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import path from "../../../../constants/path";
import classNames from "classnames";
import shopApi from "../../../../apis/shop.api";
import { formatCurrency } from "../../../../utils/utils";
import Button from "../../../../components/Button";
import { toast } from "react-toastify";
import { Pagination, PaginationProps } from "antd";

const purchaseTabs = [
  { status: "WAIT_CONFIRM", name: "Chờ xác nhận" },
  { status: "PREPARING", name: "Chuẩn bị hàng" },
  { status: "DELIVERING", name: "Đang giao" },
  { status: "DELIVERED", name: "Đã giao" },
  { status: "RETURN", name: "Đơn hoàn" },
  { status: "CANCELED", name: "Đã hủy" },
];

export default function OrderShop() {
  const queryParams: { status?: string } = useQueryParams();
  const status: string | undefined = queryParams.status;
  const [selectedTab, setSelectedTab] = useState(purchaseTabs[0].status);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ["orderShop", { selectedTab, currentPage }],
    queryFn: () => {
      return shopApi.getOrder(selectedTab, currentPage);
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
    // refetch({ status: tabStatus } as any);

    // Lấy phần tử tab được chọn
    setCurrentPage(1);
    const selectedTabElement = document.querySelector(
      `[data-status="${tabStatus}"]`
    ) as HTMLElement;
    if (selectedTabElement) {
      selectedTabElement.focus(); // Đặt focus vào tab được chọn
    }
    window.scrollTo(0, 0);
  };

  const confirmOrderMutation = useMutation({
    mutationFn: shopApi.confirmOrder,
  });

  const prepareOrderMutation = useMutation({
    mutationFn: shopApi.prepareOrder,
  });

  const onChange: PaginationProps["onChange"] = (page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  const handleConfirm = (orderId: number) => {
    if (selectedTab === "WAITE_CONFIRM") {
      confirmOrderMutation.mutate(orderId, {
        onSuccess: (response) => {
          toast.success("Thành công", {
            position: "top-center",
            autoClose: 1000,
          });
          refetch();
        },
      });
    }
    if (selectedTab === "PREPARE_GOODS") {
      prepareOrderMutation.mutate(orderId, {
        onSuccess: (response) => {
          toast.success("Thành công", {
            position: "top-center",
            autoClose: 1000,
          });
          refetch();
        },
      });
    }
  };

  const purchaseTabsLink = purchaseTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: path.orderShop,
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
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Sticky header */}
          <div className="sticky top-0 right-0 flex rounded-t-sm shadow-sm">
            {purchaseTabsLink}
          </div>
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
            {purchasesInCart?.data?.map((purchase: any) => (
              <div
                key={purchase.id}
                className=" border-2 p-2 border-gray-200 mx-2 hover:bg-slate-200
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
                  {(selectedTab === "WAIT_CONFIRM" ||
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
                  )}
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
                      {purchase.paymentOption === "PAYCASH"
                        ? "Tiền mặt"
                        : "Ví Điện tử"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            style={{ marginTop: 20 }}
            defaultCurrent={1}
            current={currentPage}
            onChange={onChange}
            total={purchasesInCartData?.data.total}
            align="center"
          />
        </div>
      </div>
    </div>
  );
}
