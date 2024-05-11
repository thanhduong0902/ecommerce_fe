import { useMutation, useQuery } from "@tanstack/react-query"
import staticApi from "../../apis/static.api"
import { useEffect, useState } from "react"
import { Bar, Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { CategoryScale } from 'chart.js';
import { formatCurrency } from "../../utils/utils";
import Button from "../../components/Button";
import axios from "axios";
Chart.register(CategoryScale);
export default function FeeStatic() {
    const [body, setBody] = useState({
        startDate: '2024-05-03',
        endDate: '2024-05-13',
    });

    // Hàm xử lý khi giá trị của input ngày tháng thay đổi
    const handleDateChange = (event: any) => {
        const { name, value } = event.target;
        setBody(prevBody => ({ ...prevBody, [name]: value }));
    };
    const downloadFile = (data: any, fileName: string) => {
        const blob = new Blob([data], { type: "application/xml" }); // Đặt type là "application/xml" nếu file là dạng XML
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Hàm xử lý khi giá trị của select box thay đổi

    const { data: profitStatistic, refetch } = useQuery({
        queryKey: ['fee', body],
        queryFn: () => {
            return staticApi.feeStatic(body)

        }
    })
    const exportMutation = useMutation({
        mutationFn: staticApi.exportStatic
    })
    const handleExport = () => {

        exportMutation.mutate(body, {
            onSuccess: (respone) => {
                downloadFile(respone.data, "transport_fee_report.xlsx")
            }
        });
    };


    return (
        <div className="p-4 items-center justify-center bg-gray-200 flex flex-col">
            <h3>Thống kê thanh toán phí vận chuyển</h3>
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
            <div className="grid grid-rows-9 gap-1">
                <div className="flex justify-between">
                    <span className="font-bold">Tổng số đơn hàng thanh toán tiền mặt</span>
                    <span className="text-orange">{profitStatistic?.data.totalPayCashOrder} </span>
                </div>
                <div className="flex justify-between">
                    <span className="font-bold">Tổng số đơn hàng thanh toán online</span>
                    <span className="text-orange">{profitStatistic?.data.totalPayWalletOrder} </span>

                </div>
                <div className="flex justify-between">
                    <span className="font-bold">Tổng tiền đơn hàng thanh toán tiền mặt</span>
                    <span className="text-orange">{formatCurrency(profitStatistic?.data.totalMoneyItemPayCashOrder)}₫</span>

                </div>
                <div className="flex justify-between">
                    <span className="font-bold">Tổng tiền đơn hàng thanh toán online</span>
                    <span className="text-orange">{formatCurrency(profitStatistic?.data.totalMoneyItemPayWalletOrder)}₫</span>

                </div>
                <div className="flex justify-between">
                    <span className="font-bold">Tổng số đơn hàng bị hoàn</span>
                    <span className="text-orange">{profitStatistic?.data.totalCancelOrder} </span>

                </div>
                <div className="flex justify-between">
                    <span className="font-bold w-4/6">Tổng chi phí vận chuyển đơn hàng bị hoàn</span>
                    <span className="text-orange">{formatCurrency(profitStatistic?.data.totalMoneyShipCancelOrder)}₫</span>

                </div>
                <div className="flex justify-between">
                    <span className="font-bold w-4/6">Tổng chi phí vận chuyển đơn hàng thanh toán tiền mặt</span>
                    <span className="text-orange">{formatCurrency(profitStatistic?.data.totalMoneyShipPayCashOrder)}₫</span>

                </div>
                <div className="flex justify-between">
                    <span className="font-bold w-4/6">Tổng chi phí vận chuyển đơn hàng thanh toán online</span>
                    <span className="text-orange">{formatCurrency(profitStatistic?.data.totalMoneyShipPayWalletOrder)} </span>

                </div>
                <div className="flex justify-between">
                    <span className="font-bold">Số tiền cần thu bên đối tác vận chuyển</span>
                    <span className="text-orange">{formatCurrency(profitStatistic?.data.amountReceivable)}₫</span>

                </div>

            </div>
            <Button
                className={`flex h-8 w-40 px-5 items-center justify-center bg-orange text-sm uppercase text-white hover:bg-orange-600 sm:ml-4 sm:mt-0 rounded-md`}
                onClick={handleExport}
            >
                Xuất báo cáo
            </Button>
        </div>
    )
}