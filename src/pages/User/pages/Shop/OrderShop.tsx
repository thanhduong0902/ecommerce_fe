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
import { Image, Modal, Pagination, PaginationProps, Select } from "antd";
import { Order, OrderDetail } from "../../../../types/purchase.type";
import moment from "moment";
import Item from "antd/es/list/Item";

const purchaseTabs = [
  { status: "WAIT_CONFIRM", name: "Chờ xác nhận" },
  { status: "PREPARING", name: "Chuẩn bị hàng" },
  { status: "DELIVERING", name: "Đang giao" },
  { status: "DELIVERED", name: "Đã giao" },
  { status: "RETURN", name: "Đơn hoàn" },
  { status: "CANCEL", name: "Đã hủy" },
];

export default function OrderShop() {
  const queryParams: { status?: string } = useQueryParams();
  const status: string | undefined = queryParams.status;
  const [selectedTab, setSelectedTab] = useState(purchaseTabs[0].status);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState<Order>();

  const [selectStatus, setSelectStatus] = useState(selectedTab);

  const handleChange = (value: string) => {};

  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ["orderShop", { selectedTab, currentPage }],
    queryFn: () => {
      return shopApi.getOrder(selectedTab, currentPage);
    },
  });
  const purchasesInCart = purchasesInCartData?.data;

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    const firstTab = document.querySelector(".tab-link") as HTMLElement; // Lấy tab đầu tiên
    if (firstTab) {
      firstTab.focus(); // Đặt focus cho tab đầu tiên
    }
  }, []); // Chỉ chạy một lần sau khi component được render

  const handleTabClick = (tabStatus: any) => {
    setSelectedTab(tabStatus); 

    setCurrentPage(1);
    const selectedTabElement = document.querySelector(
      `[data-status="${tabStatus}"]`
    ) as HTMLElement;
    if (selectedTabElement) {
      selectedTabElement.focus(); // Đặt focus vào tab được chọn
    }
    window.scrollTo(0, 0);
  };

  const prepareOrderMutation = useMutation({
    mutationFn: shopApi.prepareOrder,
  });

  const onChange: PaginationProps["onChange"] = (page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  const confirmOrderMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      shopApi.confirmOrder(orderId, status),
  });

  const handleConfirm = (orderId: number, status: string) => {
    confirmOrderMutation.mutate(
      { orderId, status },
      {
        onSuccess: (response) => {
          toast.success("Thành công", {
            position: "top-center",
            autoClose: 1000,
          });
          refetch();
        },
      }
    );
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

  const urlImage =
    "https://pushimage-production.up.railway.app/api/auth/image/";
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
                  <Select
                    defaultValue={selectedTab}
                    style={{ width: 150 }}
                    onChange={(value) => {
                      handleConfirm(purchase.id, value); // Gọi handleConfirm khi giá trị thay đổi
                    }}
                    onClick={(e) => e.stopPropagation()}
                    options={[
                      { value: "WAIT_CONFIRM", label: "Chờ xác nhận" },
                      { value: "PREPARING", label: "Chuẩn bị hàng" },
                      { value: "DELIVERING", label: "Đang giao" },
                      { value: "DELIVERED", label: "Đã giao" },
                      { value: "RETURN", label: "Đơn hoàn" },
                      { value: "CANCEL", label: "Đã hủy" },
                    ]}
                  />
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
      <Modal
        open={isOpen}
        title="Chi tiết đơn hàng"
        onCancel={closeModal}
        okText="Đồng ý"
        cancelText="Huỷ"
      >
        <div>
          <div>
            <span className="text-red font-bold">Mã đơn hàng</span>
            <span className="ml-4">#{orderDetail?.id}</span>
          </div>
          <div className="h-0.5 w-full bg-black my-4"></div>
          <div>
            <span className="mr-4 text-red font-bold">Thời gian giao hàng</span>
            {moment(orderDetail?.updated_at).format("YYYY-MM-DD HH:mm")}
          </div>
          <div className="h-0.5 w-full bg-black my-4"></div>
          <div>
            <p className="text-red font-bold">Chi tiết sản phẩm</p>
            {orderDetail?.order_details.map((item: OrderDetail) => (
              <div className="flex flex-row justify-between items-center ">
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
              </div>
            ))}
          </div>
          <div>
            <p className="text-red font-bold">Ghi chú</p>
            <div>{orderDetail?.note}</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
