import { useQuery } from "@tanstack/react-query";
import staticApi from "../../../apis/static.api";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);
export default function ProfitStatic() {
  const [body, setBody] = useState({
    start_date: "2024-05-03",
    end_date: "2024-05-13",
    status: "DATE",
  });

  // Hàm xử lý khi giá trị của input ngày tháng thay đổi
  const handleDateChange = (event: any) => {
    const { name, value } = event.target;
    setBody((prevBody) => ({ ...prevBody, [name]: value }));
  };

  // Hàm xử lý khi giá trị của select box thay đổi
  const handleTypeChange = (event: any) => {
    const { value } = event.target;
    setBody((prevBody) => ({ ...prevBody, type: value }));
  };
  const { data: profitStatistic, refetch } = useQuery({
    queryKey: ["profit", body],
    queryFn: () => {
      return staticApi.profitStatic(body);
    },
  });

  var data = {
    labels: profitStatistic?.data.label,
    datasets: [
      {
        label: "Doanh thu",
        data: profitStatistic?.data.value,
        backgroundColor: "#f0324f",
        borderColor: "#f0324f",
        tension: 0.4,
      },
    ],
  };
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-5 items-center justify-center bg-[linear-gradient(-180deg,#FFFFFF,#F8D7E5)] flex flex-col">
      <h3>Thống kê doanh thu</h3>
      <div className="flex">
        <div>
          <label>Ngày bắt đầu</label>
          <input
            name="startDate"
            className="rounded border-orange border"
            type="date"
            value={body.start_date}
            onChange={handleDateChange}
          />
        </div>
        <div>
          <label>Ngày kết thúc</label>
          <input
            className="rounded border-orange border"
            name="endDate"
            type="date"
            value={body.end_date}
            onChange={handleDateChange}
          />
        </div>
      </div>
      <Line data={data} options={options} />
    </div>
  );
}
