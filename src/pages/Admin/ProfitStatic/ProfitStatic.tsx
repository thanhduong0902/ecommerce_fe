import { useQuery } from "@tanstack/react-query"
import staticApi from "../../../apis/static.api"
import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { CategoryScale } from 'chart.js';
Chart.register(CategoryScale);
export default function ProfitStatic() {
    const [body, setBody] = useState({
        startDate: '2024-05-03',
        endDate: '2024-05-13',
        type: 'DATE'
    });

    // Hàm xử lý khi giá trị của input ngày tháng thay đổi
    const handleDateChange = (event: any) => {
        const { name, value } = event.target;
        setBody(prevBody => ({ ...prevBody, [name]: value }));
    };

    // Hàm xử lý khi giá trị của select box thay đổi
    const handleTypeChange = (event: any) => {
        const { value } = event.target;
        setBody(prevBody => ({ ...prevBody, type: value }));
    };
    const { data: profitStatistic, refetch } = useQuery({
        queryKey: ['profit', body],
        queryFn: () => {
            return staticApi.profitStatic(body)

        }
    })

    var data = {
        labels: profitStatistic?.data.label,
        datasets: [
            {
                label: "Doanh thu",
                data: profitStatistic?.data.value,
                backgroundColor: "orange",
                borderColor: "orange",
                tension: 0.4, // Đặt tension ở mức từ 0 đến 1 (0 là mềm mại nhất)

            }
        ]

    }

    return (
        <div className="p-5 items-center justify-center bg-gray-200 flex flex-col">
            <h3>Thống kê doanh thu</h3>
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
                <div>
                    <label htmlFor="type-select">Kiểu:</label>
                    {/* Select box để chọn loại ngày/tháng/tuần */}
                    <select
                        className="rounded border-orange border"
                        name="type"
                        id="type-select"
                        value={body.type}
                        onChange={handleTypeChange}
                    >
                        {/* Option cho loại ngày */}
                        <option value="DATE">Ngày</option>
                        {/* Option cho loại tuần */}
                        <option value="WEEK">Tuần</option>
                        {/* Option cho loại tháng */}
                        <option value="MONTH">Tháng</option>
                    </select>
                </div>
            </div>
            <Line
                data={data}
            />

        </div>
    )
}