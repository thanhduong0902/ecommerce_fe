import React from "react";
import { Space, Spin, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { useQuery } from "@tanstack/react-query";
import userApi, { Account } from "../../../../apis/user.api";

const columns: TableProps<Account>["columns"] = [
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Ngày tạo",
    dataIndex: "created_at",
    key: "created_at",
    render: (created_at) => new Date(created_at).toLocaleDateString(), // Format ngày
  },
  {
    title: "Số điện thoại",
    key: "phone",
    dataIndex: "phone",
  },
  {
    title: "Vai trò",
    key: "role",
    dataIndex: "role",
    render: (role) => (
      <Tag color={role === "admin" ? "blue" : "green"}>
        {role.toUpperCase()}
      </Tag>
    ),
  },
  {
    title: "Thao tác",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Chỉnh sửa</a>
      </Space>
    ),
  },
];

const data: Account[] = [];

const Member: React.FC = () => {
  const {
    data: memberData,
    refetch,
    isLoading,
    isError,
  } = useQuery<Account[]>({
    queryKey: ["member"],
    queryFn: async () => {
      const response = await userApi.getUser();
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
  return (
    <div className="container py-5">
      <div className="rounded-lg border-orange border-2">
        <Table<Account> columns={columns} dataSource={memberData} />
      </div>
    </div>
  );
};

export default Member;
