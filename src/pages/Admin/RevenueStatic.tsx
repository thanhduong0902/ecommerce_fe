import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import staticApi from "../../apis/static.api";
import { Bar, Line } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  ChartOptions,
  ChartData,
} from "chart.js/auto";

// Register chart components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function RevenuewStatic() {
  const [body, setBody] = useState({
    start_date: "2024-05-03",
    end_date: "2024-12-01",
    num: 10,
  });

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setBody((prevBody) => ({ ...prevBody, [name]: value }));
  };

  const {
    data: profitStatistic,
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profit", body],
    queryFn: () => staticApi.profitStatic(body),
    enabled: !!body.start_date && !!body.end_date, // Only run the query if both start and end date are provided
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  // Process profitStatistic data
  const labels = profitStatistic?.data?.label || [];
  const value1 = profitStatistic?.data?.value1 || []; // Doanh số bán hàng
  const value3 = profitStatistic?.data?.value3 || []; // Số lượng sản phẩm bán

  // Chart data
  const data: ChartData<"bar", "line"> = {
    labels: labels,
    datasets: [
      {
        label: "Số lượng sản phẩm bán (cái)",
        data: value1,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        yAxisID: "y-axis-1",
        type: "bar", // Bar chart for product count
      },
      {
        label: "Doanh số bán hàng (VNĐ)",
        data: value3,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        yAxisID: "y-axis-2",
      },
    ],
  };

  // Chart options with specific types for both 'bar' and 'line' charts
  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Biểu đồ đơn hàng và doanh số bán hàng",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Tháng",
        },
      },
      y: {
        position: "left",
        title: {
          display: true,
          text: "Số lượng sản phẩm",
        },
        ticks: {
          stepSize: 1,
        },
        beginAtZero: true,
      },
      y2: {
        position: "right",
        title: {
          display: true,
          text: "Doanh số (VNĐ)",
        },
        ticks: {
          callback: (value: any) => `${value} VNĐ`, // Format as VNĐ
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-5 justify-center border-orange rounded-3xl border flex flex-col">
      <h3 className="my-4 text-center">Thống kê doanh thu</h3>
      <div className="flex justify-around">
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
        <div>
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
      <div className="mt-5">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
