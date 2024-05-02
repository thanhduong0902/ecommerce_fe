import { Link } from "react-router-dom";
import { purchasesStatus } from "../../../../constants/purchase";
import useQueryParams from "../../../../hooks/useQueryParams";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import path from "../../../../constants/path";
import classNames from "classnames";
import shopApi from "../../../../apis/shop.api";
import { formatCurrency } from "../../../../utils/utils";
import Button from "../../../../components/Button";
import { toast } from "react-toastify";

const purchaseTabs = [
    { status: "WAITE_CONFIRM", name: 'Chờ xác nhận' },
    { status: "PREPARE_GOODS", name: 'Chuẩn bị hàng' },
    { status: "DELIVERING", name: 'Đang giao' },
    { status: "DELIVERED", name: 'Đã giao' },
    { status: "CANCELED", name: 'Đã hủy' },
]

export default function OrderShop() {

    const queryParams: { status?: string } = useQueryParams()
    const status: string | undefined = queryParams.status
    const [selectedTab, setSelectedTab] = useState(purchaseTabs[0].status);

    const { data: purchasesInCartData, refetch } = useQuery({
        queryKey: ['orderShop', { selectedTab }],
        queryFn: () => {
            return shopApi.getOrder(selectedTab)

        }
    })
    const purchasesInCart = purchasesInCartData?.data

    useEffect(() => {
        const firstTab = document.querySelector('.tab-link') as HTMLElement; // Lấy tab đầu tiên
        if (firstTab) {
            firstTab.focus(); // Đặt focus cho tab đầu tiên
        }
    }, []); // Chỉ chạy một lần sau khi component được render

    const handleTabClick = (tabStatus: any) => {
        setSelectedTab(tabStatus); // Lưu trạng thái của tab được chọn
        // refetch({ status: tabStatus } as any);

        // Lấy phần tử tab được chọn
        const selectedTabElement = document.querySelector(`[data-status="${tabStatus}"]`) as HTMLElement;
        if (selectedTabElement) {
            selectedTabElement.focus(); // Đặt focus vào tab được chọn
        }
    }

    const confirmOrderMutation = useMutation({
        mutationFn: shopApi.confirmOrder,
    })

    const prepareOrderMutation = useMutation({
        mutationFn: shopApi.prepareOrder,
    })

    const handleConfirm = (orderId: number) => {
        if (selectedTab === "WAITE_CONFIRM") {
            confirmOrderMutation.mutate(orderId, {
                onSuccess: (response) => {
                    toast.success('Thành công', {
                        position: 'top-center',
                        autoClose: 1000
                    })
                    refetch()
                }
            })
        }
        if (selectedTab === "PREPARE_GOODS") {
            prepareOrderMutation.mutate(orderId, {
                onSuccess: (response) => {
                    toast.success('Thành công', {
                        position: 'top-center',
                        autoClose: 1000
                    })
                    refetch()
                }
            })
        }
    }

    const purchaseTabsLink = purchaseTabs.map((tab) => (
        <Link
            key={tab.status}
            to={{
                pathname: path.orderShop,
                // search: createSearchParams({
                //     status: String(tab.status)
                // }).toString()
            }}
            onClick={() => handleTabClick(tab.status)}
            className={classNames('tab-link', 'flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
                'border-b-orange text-orange': selectedTab === tab.status, // Tab được chọn
                'border-b-black/10 text-gray-900': selectedTab !== tab.status // Tab không được chọn
            })}
        >
            {tab.name}
        </Link>
    ))
    return (
        <div>
            <div className='overflow-x-auto'>
                <div className='min-w-[700px]'>
                    <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{purchaseTabsLink}</div>
                    <div>
                        {
                            purchasesInCart?.map((purchase: any) => (
                                <div key={purchase.id} className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm items-center justify-between
                                flex
                                '>

                                    <div className='ml-3 flex-grow overflow-hidden'>
                                        <div className='truncate'>{purchase.id}</div>
                                    </div>
                                    <div className='sm:pl-5 mr-20 flex-column'>
                                        {(selectedTab === "WAITE_CONFIRM" || selectedTab === "PREPARE_GOODS") &&
                                            (
                                                <>
                                                    <Button
                                                        className='flex h-9 w-32 items-center justify-center rounded-sm bg-orange px-5 text-sm text-white hover:bg-orange/80'
                                                        type='button'
                                                        onClick={() => handleConfirm(purchase.id)}
                                                    >
                                                        Xác nhận
                                                    </Button>
                                                    <Button
                                                        className='flex h-9 w-32 my-2 items-center justify-center rounded-sm bg-orange px-5 text-sm text-white hover:bg-orange/80'
                                                        type='button'

                                                    >
                                                        Từ chối
                                                    </Button></>
                                            )
                                        }

                                    </div>
                                    <div>
                                        <div className='flex justify-end'>
                                            <div>
                                                <span>Tổng tiền sản phẩm</span>
                                                <span className='ml-4 text-orange'>
                                                    ₫{formatCurrency(purchase.totalMoneyItem)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className='flex justify-end'>
                                            <div>
                                                <span>Tổng phí ship</span>
                                                <span className='ml-4 text-orange'>
                                                    ₫{formatCurrency(purchase.totalMonneyShip)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className='flex justify-end'>
                                            <div>
                                                <span>Tổng giá tiền</span>
                                                <span className='ml-4 text-xl text-orange'>
                                                    ₫{formatCurrency(purchase.amount)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className='flex justify-end'>
                                            <div>
                                                <span>Phương thức thanh toán</span>
                                                <span className='ml-4 text text-orange'>
                                                    {purchase.paymentOption === "PAY_CASH" ? "Tiền mặt" : "Ví Điện tử"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}