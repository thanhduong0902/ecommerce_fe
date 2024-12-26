import React, { useState } from "react";
import { DatePicker, Modal, Space, Spin, Table, Tag } from "antd";
import type { DatePickerProps, TableProps } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import userApi, { Account } from "../../../apis/user.api";
import couponApi, { BodyCoupon, Coupon } from "../../../apis/coupons.api";
import { PlusCircleOutlined } from "@ant-design/icons";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Input from "../../../components/Input";

const columns: TableProps<Coupon>["columns"] = [
  {
    title: "Số thứ tự",
    dataIndex: "id",
    key: "id",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Mã",
    dataIndex: "code",
    key: "code",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
    key: "quantity",
  },
  {
    title: "Ngày hết hạn",
    dataIndex: "expiration_date",
    key: "expiration_date",
    render: (expiration_date) => new Date(expiration_date).toLocaleDateString(), // Format ngày
  },
  {
    title: "Giá áp dụng",
    key: "accept_price",
    dataIndex: "accept_price",
  },
  {
    title: "Giảm giá tối đa",
    key: "max_discount",
    dataIndex: "max_discount",
    render: (max_discount) => <Tag color="orange">{max_discount}</Tag>,
  },
  {
    title: "Tỷ lệ",
    key: "ratio",
    dataIndex: "ratio",
    // render: (_, record) => (
    //   <Space size="middle">
    //     <a>Chỉnh sửa</a>
    //   </Space>
    // ),
  },
];

const data: Coupon[] = [];

const Coupons: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const createCouponMutation = useMutation({
    mutationFn: couponApi.addCoupon,
  });
  function closeModal() {
    setIsOpen(false);
  }

  const methods = useForm<BodyCoupon>({
    defaultValues: {
      quantity: 0,
    },
  });
  const [date, setDate] = useState<string | string[]>("");

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    getValues,
    setError,
  } = methods;
  const {
    data: memberData,
    refetch,
    isLoading,
    isError,
  } = useQuery<Coupon[]>({
    queryKey: ["coupon"],
    queryFn: async () => {
      const response = await couponApi.getCoupon();
      return response.data; // Trả về data từ AxiosResponse
    },
  });
  if (isLoading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
    );
  }

  if (isError) {
    return (
      <p style={{ color: "red", textAlign: "center" }}>
        Đã xảy ra lỗi khi tải dữ liệu.
      </p>
    );
  }
  const onSubmit = handleSubmit((data: BodyCoupon) => {
    const body = {
      code: data.code,
      ratio: data.ratio,
      quantity: data.quantity,
      accept_price: data.accept_price,
      max_discount: data.max_discount,
      expiration_date: date,
    };
    createCouponMutation.mutate(body, {
      onSuccess: (response) => {
        toast.success("Thành công", {
          position: "top-center",
          autoClose: 1000,
        });
        refetch();
        setIsOpen(!isOpen);
      },
    });
  });

  const onChange: DatePickerProps["onChange"] = (
    date,
    dateString: string | string[]
  ) => {
    setDate(dateString); // `dateString` là giá trị dạng chuỗi của ngày
    console.log("Selected Date:", dateString);
  };
  return (
    <div className="container">
      <div className="p-4">
        <div className="flex gap-3">
          <div className="text-3xl text-orange font-bold py-3">Mã giảm giá</div>
          <PlusCircleOutlined
            onClick={() => setIsOpen(true)}
            style={{ fontSize: "30px", color: "red", cursor: "pointer" }}
          />
        </div>

        <div className="rounded-xl border-orange border-2">
          <Table<Coupon> columns={columns} dataSource={memberData} />
        </div>
      </div>
      <Modal
        open={isOpen}
        title="Thêm mã giảm giá"
        onOk={onSubmit}
        onCancel={closeModal}
        okText="Đồng ý"
        cancelText="Huỷ"
      >
        <FormProvider {...methods}>
          <form
            className="mt-2 flex flex-col md:flex-col md:items-start"
            onSubmit={onSubmit}
          >
            <div className="flex flex-col w-full">
              <div className="flex flex-col gap-2">
                <div className="truncate capitalize sm:text-left">Mã</div>
                <div className="w-full">
                  <Input
                    classNameInput="w-full justify-items-start rounded-2xl border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                    name="code"
                    placeholder="Mã"
                    register={register}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="truncate capitalize sm:text-left">Số lượng</div>
                <div className="w-full">
                  <Input
                    classNameInput="w-full justify-items-start rounded-2xl border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                    name="quantity"
                    placeholder="Số lượng"
                    register={register}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <div className="truncate pt-3 capitalize sm:text-left">
                  Giá áp dụng
                </div>
                <div className="w-full">
                  <Input
                    classNameInput="w-full justify-items-start rounded-2xl border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                    name="accept_price"
                    placeholder="Giá áp dụng"
                    register={register}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <div className="truncate pt-3 capitalize sm:text-left">
                  Giảm giá tối đa
                </div>
                <div className="w-full">
                  <Input
                    classNameInput="w-full justify-items-start rounded-2xl border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                    name="max_discount"
                    placeholder="Giá bán"
                    register={register}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <div className="truncate pt-3 capitalize sm:text-left">
                  Tỷ lệ
                </div>
                <div className="w-full">
                  <Input
                    classNameInput="w-full justify-items-start rounded-2xl border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                    name="ratio"
                    placeholder="Tỷ lệ"
                    register={register}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <div className="truncate pt-3 capitalize sm:text-left">
                  Ngày hết hạn
                </div>
                <div className="w-full">
                  <DatePicker onChange={onChange} />
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </Modal>
    </div>
  );
};

export default Coupons;
