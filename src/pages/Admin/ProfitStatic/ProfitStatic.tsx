import { useQuery } from "@tanstack/react-query";
import staticApi from "../../../apis/static.api";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { CategoryScale } from "chart.js";
import RevenuewStatic from "../RevenueStatic";
import TopProducts from "../TopProducts";
import TopUser from "../TopUser";
Chart.register(CategoryScale);
export default function ProfitStatic() {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {/* Cột 1: RevenueStatic và TopProducts */}
      <div className="col-span-2 grid grid-rows-2 gap-4">
        {/* RevenueStatic (Hàng 1) */}
        <div className=" p-4">
          <RevenuewStatic />
        </div>

        {/* TopProducts (Hàng 2) */}
        <div className=" p-4">
          <TopProducts />
        </div>
      </div>

      {/* Cột 2: TopUser */}
      <div className="col-span-1 p-4">
        <TopUser />
      </div>
    </div>
  );
}
