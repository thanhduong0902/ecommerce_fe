import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { createSearchParams, Link } from 'react-router-dom'
import purchaseApi from '../../../../apis/purchase.api'
import path from '../../../../constants/path'
import { purchasesStatus } from '../../../../constants/purchase'
import useQueryParams from '../../../../hooks/useQueryParams'
import { PurchaseListStatus, PurchaseStatus } from '../../../../types/purchase.type'
import { formatCurrency, generateNameId } from '../../../../utils/utils'
import { QueryConfig } from '../../../../hooks/useQueryConfig'
import Button from '../../../../components/Button'
import Modal from 'react-modal'
import { useEffect, useState } from 'react'
const purchaseTabs = [
    { status: purchasesStatus.wait_confirm, name: 'Chờ xác nhận' },
    { status: purchasesStatus.delevering, name: 'Đang giao' },
    { status: purchasesStatus.delevered, name: 'Đã giao' },
    { status: purchasesStatus.canceled, name: 'Đã hủy' },
]

export default function HistoryPurchase() {
    const queryParams: { status?: string } = useQueryParams()
    const status: string | undefined = queryParams.status
    const [selectedTab, setSelectedTab] = useState(purchaseTabs[0].status);

    const { data: purchasesInCartData, refetch } = useQuery({
        queryKey: ['purchases', { selectedTab }],
        queryFn: () => {
            return purchaseApi.getOrder(selectedTab)

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
        refetch({ status: tabStatus } as any);

        // Lấy phần tử tab được chọn
        const selectedTabElement = document.querySelector(`[data-status="${tabStatus}"]`) as HTMLElement;
        if (selectedTabElement) {
            selectedTabElement.focus(); // Đặt focus vào tab được chọn
        }
    }

    const purchaseTabsLink = purchaseTabs.map((tab) => (
        <Link
            key={tab.status}
            to={{
                pathname: path.historyPurchase,
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
                                <div key={purchase._id} className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'>
                                    <div
                                        // to={`${path.home}${generateNameId({ name: purchase.product.title, id: purchase.product._id })}`}
                                        className='flex'
                                    >
                                        <div className='flex-shrink-0'>
                                            {/* <img className='h-20 w-20 object-cover' src={purchase.product.image} alt={purchase.product.name} /> */}
                                        </div>
                                        <div className='ml-3 flex-grow overflow-hidden'>
                                            <div className='truncate'>{purchase.id}</div>
                                        </div>
                                        <div className='ml-3 flex-shrink-0'>
                                            {/* <span className='truncate text-gray-500 line-through'>
                                                ₫{formatCurrency(purchase.amount)}
                                            </span> */}
                                            <span>Tổng tiền sản phẩm</span>
                                            <span className='ml-2 truncate text-orange'>₫{formatCurrency(purchase.totalMoneyItem)}</span>
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
                            ))
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}
