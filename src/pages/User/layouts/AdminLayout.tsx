import React, { useContext, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import UserSideNav from "../components/UserSideNav";
import AdminSideNav from "../components/AdminSideNav";

import "./ChartStyle.css"; // Import file CSS của bạn

import HeaderAdmin from "../../../components/HeaderAdmin";
import { Helmet } from "react-helmet-async";
import "./style.css";
interface Props {
  children?: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="main">
      <Helmet>
        <title>Admin</title>
      </Helmet>
      {/* <div className="h-full"> */}
      <div className="header">
        <HeaderAdmin />
      </div>
      <div className="w-full grid grid-cols-5 overflow-hidden opacity-100 ">
        {/* SideNav */}
        <div className="col-span-1 h-screen pl-10 border-r-2 border-orange pt-24">
          <AdminSideNav />
        </div>

        {/* Nội dung */}
        <div className="col-span-4 h-screen content pt-24 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
    // </div>
  );
}
