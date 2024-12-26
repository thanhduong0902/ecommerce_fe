import { useQuery } from "@tanstack/react-query";
import staticApi from "../../../apis/static.api";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { CategoryScale } from "chart.js";
import Flavor from "./Flavor";
import Category from "./Category";
import Characteric from "./Characteric";
import { Button } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import specificApi from "../../../apis/specific.api";
export default function Specific() {
  const handleTrain = async () => {
    try {
      const response = await specificApi.train();
      toast.success("Training thành công!");
    } catch (error) {
      console.error("Lỗi khi gọi API train:", error);
      alert("Đã xảy ra lỗi khi training.");
    }
  };
  return (
    <div className="container ml-5">
      <Flavor />
      <Category />
      <Characteric />
      <div className="flex items-center justify-center" onClick={handleTrain}>
        <button className="px-4 my-4 py-2 w-40 items-center text-white bg-orange rounded-md shadow-md">
          Huấn luyện
        </button>
      </div>
    </div>
  );
}
