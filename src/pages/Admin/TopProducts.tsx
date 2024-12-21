import { useQuery } from "@tanstack/react-query";
import staticApi from "../../apis/static.api";
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { CategoryScale } from "chart.js";
import Lottie from "lottie-react";
import wait from "../../animation/wait.json";
Chart.register(CategoryScale);
export default function TopProducts() {
  const [body, setBody] = useState({
    start_date: "2024-12-01",
    end_date: new Date().toISOString().split("T")[0], // Lấy ngày hiện tại
    num: 10,
  });

  // Hàm xử lý khi giá trị của input ngày tháng thay đổi
  const handleDateChange = (event: any) => {
    const { name, value } = event.target;
    setBody((prevBody) => ({ ...prevBody, [name]: value }));
  };

  // Hàm xử lý khi giá trị của select box thay đổi

  const {
    data: profitStatistic,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["topProduct", body],
    queryFn: () => {
      return staticApi.topProductStatic(body);
    },
  });

  console.log("topProduct", profitStatistic);

  var data = {
    labels: profitStatistic?.data.label,
    datasets: [
      {
        label: "Sản phẩm",
        data: profitStatistic?.data.value,
        backgroundColor: "#FC8018",
        borderRadius: 10,
      },
    ],
  };

  return (
    <div className="p-5 justify-center border-orange rounded-3xl border flex flex-col">
      <h3 className="text-center">Thống kê sản phẩm</h3>
      <div className="flex flex-row my-4 justify-around items-center">
        <div>
          <label>Ngày bắt đầu</label>
          <input
            name="start_date"
            className="rounded border-orange border ml-4"
            type="date"
            value={body.start_date}
            onChange={handleDateChange}
          />
        </div>
        <div className=" ml-5">
          <label>Ngày kết thúc</label>
          <input
            className="rounded border-orange border ml-4"
            name="end_date"
            type="date"
            value={body.end_date}
            onChange={handleDateChange}
          />
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Lottie
            animationData={wait}
            style={{ width: "200px", height: "200px" }}
          />
        </div>
      ) : (
        <Bar data={data} />
      )}
    </div>
  );
}
