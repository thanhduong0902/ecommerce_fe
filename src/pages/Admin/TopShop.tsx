import { useQuery } from "@tanstack/react-query"
import staticApi from "../../apis/static.api"
import { useEffect, useState } from "react"
import { Bar, Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { CategoryScale } from 'chart.js';
Chart.register(CategoryScale);
export default function TopShop() {
    const [body, setBody] = useState({
        startDate: '2024-05-03',
        endDate: '2024-05-13',
    });

    // Hàm xử lý khi giá trị của input ngày tháng thay đổi
    const handleDateChange = (event: any) => {
        const { name, value } = event.target;
        setBody(prevBody => ({ ...prevBody, [name]: value }));
    };

    // Hàm xử lý khi giá trị của select box thay đổi

    const { data: profitStatistic, refetch } = useQuery({
        queryKey: ['topShop', body],
        queryFn: () => {
            return staticApi.topShopStatic(body)

        }
    })

    var data = {
        labels: profitStatistic?.data.label,
        datasets: [
            {
                label: "Shop",
                data: profitStatistic?.data.value,
                backgroundColor: "#4ba4f2",

            }
        ]

    }

    return (
        <div className=" p-5 items-center justify-center bg-[linear-gradient(-180deg,#FFFFFF,#F8D7E5)] flex flex-col">
            <h3>Thống kê shop</h3>
            <div className="flex">
                <div>
                    <label>Ngày bắt đầu</label>
                    <input
                        name="startDate"
                        className="rounded border-orange border"
                        type="date"
                        value={body.startDate}
                        onChange={handleDateChange}
                    />
                </div>
                <div>
                    <label>Ngày kết thúc</label>
                    <input
                        className="rounded border-orange border"
                        name="endDate"
                        type="date"
                        value={body.endDate}
                        onChange={handleDateChange}
                    />
                </div>

            </div>
            <Bar
                data={data}
            />

        </div>
    )
}