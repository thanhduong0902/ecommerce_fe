import React, { useContext, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import UserSideNav from "../components/UserSideNav";
import AdminSideNav from "../components/AdminSideNav";

import "./ChartStyle.css"; // Import file CSS của bạn

import HeaderAdmin from "../../../components/HeaderAdmin";
import { Helmet } from "react-helmet-async";

interface Props {
  children?: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="overflow-hidden">
      <Helmet>
        <title>Admin</title>
      </Helmet>
      <div className="h-full">
        <HeaderAdmin />
        <div className="overflow-hidden">
          <div className="grid grid-cols-10">
            {/* SideNav */}
            <div className="col-span-4 lg:col-span-2 h-screen pl-10 border-r-2 border-orange">
              <AdminSideNav />
            </div>

            {/* Nội dung */}
            <div className="col-span-6 lg:col-span-8 h-full overflow-y-auto">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
