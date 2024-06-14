import { useQuery } from "@tanstack/react-query"
import staticApi from "../../apis/static.api"
import { useContext, useEffect, useState } from "react"
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import moment from "moment";
import InputNumber from "../../components/InputNumber";
import { toast } from "react-toastify";
import { AppContext } from "../../context/app.context";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
export default function OrderStatic() {
    const { isAuthenticated, targetValue, setTargetValue } = useContext(AppContext)
    // Hàm xử lý khi giá trị của input ngày tháng thay đổi
    const { data: profitStatistic, refetch } = useQuery({
        queryKey: ['profit'],
        queryFn: () => {
            return staticApi.orderStatic()

        }
    })
    const checkData = () => {
        const checkValue = profitStatistic?.data.value.some((item: any) => item > targetValue)
        if (checkValue) {
            toast.warning('Bạn đã vượt KPI', {
                position: 'top-center',
                autoClose: 3000
            })
        }
    }
    useEffect(() => {
        checkData()
    }, [targetValue])
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

    var data = {
        labels: labels,
        datasets: [
            {
                label: "Đơn hàng",
                data: profitStatistic?.data.value,
                backgroundColor: "#89ddf0",
                borderColor: "#3bd5f7",
                tension: 0.4
            },
            {
                label: 'KPI',
                fill: false,
                backgroundColor: "#863bf7",
                borderColor: "#863bf7",
                borderDash: [5, 5],
                data: profitStatistic?.data.value.map((item: any) =>
                    targetValue
                )


            }
        ]
    }
    const options = {
        scales: {
            y: {
                beginAtZero: true,
                afterDataLimits: (scale: any) => {
                    scale.max = Math.max(targetValue) + 5;
                }
            }
        },
        plugins: {
            legend: {
                display: true,
            },
            title: {
                display: true,

            },
        },
        elements: {
            point: {
                radius: 0 // Không hiển thị các điểm dữ liệu
            }
        },
        annotation: {
            annotations: {
                line1: {
                    type: 'line',
                    yMin: targetValue,
                    yMax: targetValue,
                    borderColor: 'green',
                    borderWidth: 2,
                    label: {
                        content: 'Target',
                        enabled: true,
                        position: 'end'
                    }
                }
            }
        }
    };
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let _value = Number(event.target.value)
        setTargetValue(_value)
    }


    return (
        <div className="p-5 items-center justify-center bg-[linear-gradient(-180deg,#FFFFFF,#F8D7E5)] flex flex-col">
            <div className="flex items-center">
                <h3>Thống kê đơn hàng</h3>
                <div className="items-center ml-20 justify-center flex">
                    <p className="mr-5">KPI</p>
                    <InputNumber
                        className=''
                        classNameError='hidden'
                        classNameInput='h-8 w-14 border rounded border-pink-500 p-1 text-center outline-none'
                        onChange={handleChange}
                        value={targetValue}
                    />
                </div>
            </div >

            <Line
                data={data}
                options={options}
            />

        </div>
    )
}