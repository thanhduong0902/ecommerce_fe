import React, { useState } from "react";
import {
  AppstoreOutlined,
  CalendarOutlined,
  LinkOutlined,
  MailOutlined,
  MessageOutlined,
  SettingOutlined,
  TagsOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Divider, Menu, Switch } from "antd";
import type { GetProp, MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import path from "../../../../constants/path";

type MenuTheme = GetProp<MenuProps, "theme">;

type MenuItem = GetProp<MenuProps, "items">[number];

const MenuNav: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>("1"); // Theo dõi mục đang được chọn

  const [mode, setMode] = useState<"vertical" | "inline">("inline");
  const [theme, setTheme] = useState<MenuTheme>("light");

  const navigate = useNavigate();

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const rootSubmenuKeys = ["sub1"];

  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));
    if (rootSubmenuKeys.includes(latestOpenKey!)) {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    } else {
      setOpenKeys(keys);
    }
  };

  const handleMenuClick = (key: string, path: string) => {
    setSelectedKey(key); // Cập nhật mục được chọn
    navigate(path); // Điều hướng đến trang tương ứng
  };

  const items: MenuItem[] = [
    {
      key: "1",
      icon: <MailOutlined />,
      label: "Thống kê",
      onClick: () => handleMenuClick("1", path.profit),
    },
    {
      key: "2",
      icon: <CalendarOutlined />,
      label: "Quản lí đơn hàng",
      onClick: () => handleMenuClick("2", path.orderShop),
    },
    {
      key: "sub1",
      label: "Quản lí sản phẩm",
      icon: <AppstoreOutlined />,
      children: [
        {
          key: "3",
          label: "Danh mục",
          onClick: () => handleMenuClick("3", path.specific),
        },
        {
          key: "4",
          label: "Sản phẩm",
          onClick: () => handleMenuClick("4", path.productShop),
        },
      ],
    },
    {
      key: "5",
      label: "Quản lí người dùng",
      icon: <UserOutlined />,
      onClick: () => handleMenuClick("5", path.member),
    },
    {
      key: "6",
      label: "Tin nhắn",
      icon: <MessageOutlined />,
      onClick: () => handleMenuClick("6", path.message),
    },
    {
      key: "7",
      label: "Mã giảm giá",
      icon: <TagsOutlined />,
      onClick: () => handleMenuClick("7", path.coupons),
    },
  ];

  return (
    <>
      <Menu
        // defaultSelectedKeys={["1"]}
        // defaultOpenKeys={["sub1"]}
        mode={mode}
        theme={theme}
        items={items}
      />
    </>
  );
};

export default MenuNav;
