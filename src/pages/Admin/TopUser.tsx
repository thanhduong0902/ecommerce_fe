import { useQuery } from "@tanstack/react-query";
import staticApi from "../../apis/static.api";
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { formatCurrency } from "../../utils/utils";
Chart.register(CategoryScale);
export default function TopUser() {
  const [body, setBody] = useState({
    start_date: "2024-11-03",
    end_date: new Date().toISOString().split("T")[0], // Lấy ngày hiện tại
    num: 10,
  });

  // Hàm xử lý khi giá trị của input ngày tháng thay đổi
  const handleDateChange = (event: any) => {
    const { name, value } = event.target;
    setBody((prevBody) => ({ ...prevBody, [name]: value }));
  };

  // Hàm xử lý khi giá trị của select box thay đổi

  const { data: profitStatistic, refetch } = useQuery({
    queryKey: ["topProduct", body],
    queryFn: () => {
      return staticApi.topUserStatic(body);
    },
  });

  return (
    <div className="p-5 justify-center bg-orange rounded-3xl border border-orange flex flex-col">
      <h3 className="mb-5 text-center">Thống kê người dùng</h3>
      <div className="flex">
        <div>
          <label>Ngày bắt đầu</label>
          <input
            name="start_date"
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
            name="end_date"
            type="date"
            value={body.end_date}
            onChange={handleDateChange}
          />
        </div>
      </div>
      <div>
        {profitStatistic &&
          profitStatistic.data.label.map((item: any, index: number) => (
            <div className="flex flex-row justify-between items-center my-2 text-white">
              <div>{profitStatistic?.data?.label[index]}</div>
              <div>{formatCurrency(profitStatistic?.data?.value[index])}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
