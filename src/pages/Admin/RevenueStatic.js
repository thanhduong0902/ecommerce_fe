import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import staticApi from "../../apis/static.api";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Legend, Tooltip, Title } from "chart.js";
import { Chart } from "react-chartjs-2";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Legend, Tooltip, Title);

export default function RevenuewStatic() {
  const [body, setBody] = useState({
    start_date: "2024-11-03",
    end_date: "2024-12-01",
    num: 10,
  });

  const handleDateChange = (event) => {
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

  // Process profitStatistic data
  const labels = profitStatistic?.data?.label || [];
  const value1 = profitStatistic?.data?.value1 || []; // Số lượng sản phẩm bán
  const value3 = profitStatistic?.data?.value3 || []; // Doanh số bán hàng

  // Chart data
  const data = {
    labels: labels,
    datasets: [
      {
        type: "bar",
        label: "Số lượng sản phẩm bán (cái)",
        data: value1,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        borderRadius: 10,
        yAxisID: "y",
      },
      {
        type: "line",
        label: "Doanh số bán hàng (VNĐ)",
        data: value3,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        yAxisID: "y2",
        fill: false,
        tension: 0.4, // Smooth lines
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
      },
    ],
  };

  // Chart options with specific types for both 'bar' and 'line' charts
  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Thống kê doanh thu",
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.dataset.type === 'line') {
                label += new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.parsed.y);
              } else {
                label += context.parsed.y;
              }
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Ngày",
        },
      },
      y: {
        type: "linear",
        display: true,
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
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Doanh số (VNĐ)",
        },
        ticks: {
          callback: (value) => `${value.toLocaleString('vi-VN')} VNĐ`, // Format as VNĐ
        },
        grid: {
          drawOnChartArea: false, // Prevent grid lines overlap
        },
        beginAtZero: true,
      },
    },
  };

  // Conditional rendering based on loading and error states
  // if (isLoading) {
  //   return <div className="px-5 justify-center border-orange rounded-3xl border flex flex-col"><p>Loading...</p></div>;
  // }

  // if (isError) {
  //   return <div className="px-5 justify-center border-orange rounded-3xl border flex flex-col"><p>Đã xảy ra lỗi khi tải dữ liệu.</p></div>;
  // }

  return (
    <div className="px-5 justify-center border-orange rounded-3xl border flex flex-col">
      <h3 className="my-4 text-center">Thống kê doanh thu</h3>
      <div className="flex justify-around mb-4">
        <div>
          <label htmlFor="start_date">Ngày bắt đầu:</label>
          <input
            id="start_date"
            name="start_date"
            className="rounded border-orange border ml-2"
            type="date"
            value={body.start_date}
            onChange={handleDateChange}
          />
        </div>
        <div>
          <label htmlFor="end_date">Ngày kết thúc:</label>
          <input
            id="end_date"
            name="end_date"
            className="rounded border-orange border ml-2"
            type="date"
            value={body.end_date}
            onChange={handleDateChange}
          />
        </div>
      </div>
      {labels.length > 0 && (
        <Chart type='bar' data={data} options={options} />
      ) }
    </div>
  );
}
