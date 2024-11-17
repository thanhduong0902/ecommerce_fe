import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import UserSideNav from "../components/UserSideNav";
import AdminSideNav from "../components/AdminSideNav";
import NavHeader from "../../../components/NavHeader";
import ProfitStatic from "../../Admin/ProfitStatic";
import TopProducts from "../../Admin/TopProducts";
import TopShop from "../../Admin/TopShop";
import OrderStatic from "../../Admin/OrderStatic";
import FeeStatic from "../../Admin/FeeStatic";
import "./ChartStyle.css"; // Import file CSS của bạn
import Modal from "react-modal";
import { AppContext } from "../../../context/app.context";
import Headers from "../../../components/Headers";
import Footer from "../../../components/Footer";
import HeaderAdmin from "../../../components/HeaderAdmin";
const ZoomableComponent = ({ children }: any) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`zoom-container ${hovered ? "hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
};

interface Props {
  children?: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <div>
      <div>
        <HeaderAdmin />
        <div className="h-screen">
          <div className="grid grid-cols-10 h-full">
            {/* SideNav */}
            <div className="col-span-4 lg:col-span-2 h-full pl-10 border-r-2 border-orange">
              <AdminSideNav />
            </div>

            {/* Nội dung */}
            <div className="col-span-8 lg:col-span-8 h-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
