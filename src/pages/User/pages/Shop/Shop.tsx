import { Link, Routes, Route, NavLink, Outlet } from "react-router-dom";
import path from "../../../../constants/path";
import classNames from "classnames";
import { useEffect, useState } from "react";
import InfoShop from "../InfoShop/InfoShop";
import ProductShop from "../ProductShop/ProductShop";
import OrderShop from "./OrderShop";

const shopTabs = [
    { path: path.infoShop, name: 'Thông tin Shop', component: InfoShop },
    { path: path.productShop, name: 'Sản phẩm', component: ProductShop },
    { path: path.orderShop, name: 'Đơn hàng', component: OrderShop }
]

export default function Shop() {
    const [selectedTab, setSelectedTab] = useState('');

    // useEffect(() => {
    //     const firstTab = document.querySelector('.tab-link') as HTMLElement; // Lấy tab đầu tiên
    //     if (firstTab) {
    //         firstTab.focus(); // Đặt focus cho tab đầu tiên
    //     }
    // }, []); // Chỉ chạy một lần sau khi component được render

    const handleTabClick = (tabName: string) => {
        setSelectedTab(tabName); // Lưu trạng thái của tab được chọn

        // Lấy phần tử tab được chọn
        const selectedTabElement = document.querySelector(`[data-status="${tabName}"]`) as HTMLElement;
        if (selectedTabElement) {
            selectedTabElement.focus(); // Đặt focus vào tab được chọn
        }
    }

    const shopTabsLink = shopTabs.map((tab) => (
        <NavLink
            key={tab.name}
            to={tab.path}
            onClick={() => handleTabClick(tab.name)}
            className={classNames('tab-link', 'flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
                'border-b-orange text-orange': selectedTab === tab.name, // Tab được chọn
                'border-b-black/10 text-gray-900': selectedTab !== tab.name // Tab không được chọn
            })}
        >
            {tab.name}
        </NavLink>
    ));

    return (
        <div>
            <div className='overflow-x-auto'>
                <div className='min-w-[700px]'>
                    <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{shopTabsLink}</div>
                    <div>
                        {/* <Routes>
                            {shopTabs.map((tab) => (
                                <Route key={tab.name} path={tab.path} element={<tab.component />} />
                            ))}
                        </Routes> */}
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
