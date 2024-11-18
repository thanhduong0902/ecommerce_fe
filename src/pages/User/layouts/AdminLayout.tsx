import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import UserSideNav from "../components/UserSideNav";
import AdminSideNav from "../components/AdminSideNav";

import "./ChartStyle.css"; // Import file CSS của bạn

import HeaderAdmin from "../../../components/HeaderAdmin";
import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>Admin</title>
        {/* <meta
                    name='description'
                    content={convert(product.description, {
                        limits: {
                            maxInputLength: 150
                        }
                    })}
                /> */}
      </Helmet>
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
