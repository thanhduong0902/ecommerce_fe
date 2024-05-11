import { useQuery } from "@tanstack/react-query"
import staticApi from "../../apis/static.api"
import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { CategoryScale } from 'chart.js';
import moment from "moment";
Chart.register(CategoryScale);
export default function OrderStatic() {

    // Hàm xử lý khi giá trị của input ngày tháng thay đổi
    const { data: profitStatistic, refetch } = useQuery({
        queryKey: ['profit'],
        queryFn: () => {
            return staticApi.orderStatic()

        }
    })
    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 60000); // refetch mỗi 60 giây

        // Xóa interval khi component unmount để tránh memory leak
        return () => clearInterval(interval);
    }, [refetch]);

    const labels = profitStatistic?.data.label.map((timestamp: any) => {
        // Parse timestamp và thêm 7 giờ vào
        const formattedTime = moment(timestamp, "HH:mm:ss").add(7, 'hours').format("HH:mm:ss")
        return formattedTime;
    }
    )
    console.log(profitStatistic?.data.label)

    var data = {
        labels: labels,
        datasets: [
            {
                label: "Đơn hàng",
                data: profitStatistic?.data.value,
                backgroundColor: "orange",
                borderColor: "orange",

            }
        ]

    }

    return (
        <div className="p-5 items-center justify-center bg-gray-200 flex flex-col">
            <h3>Thống kê đơn hàng</h3>

            <Line
                data={data}
            />

        </div>
    )
}