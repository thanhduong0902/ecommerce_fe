import { Outlet } from 'react-router-dom'
import UserSideNav from '../components/UserSideNav'
import AdminSideNav from '../components/AdminSideNav'
import NavHeader from '../../../components/NavHeader'
import ProfitStatic from '../../Admin/ProfitStatic'
import TopProducts from '../../Admin/TopProducts'
import TopShop from '../../Admin/TopShop'
import OrderStatic from '../../Admin/OrderStatic'
import FeeStatic from '../../Admin/FeeStatic'


export default function AdminLayout() {
    return (
        <div>
            <div className='bg-[linear-gradient(-180deg,#f53d2d,#f63)] p-5 pt-2 text-white'>
                <NavHeader />

            </div>
            <div className="grid grid-flow-row grid-cols-3 grid-rows-2 gap-4 p-2">
                <div className="col-span-2 md:col-span-2 bg-gray-200 rounded border ">
                    <OrderStatic />
                </div>
                <div className="col-span-1 md:col-span-1 rounded border">
                    <FeeStatic />
                </div>

                <div className="col-span-1 md:col-span-1 ">
                    <TopShop />
                </div>
                <div className="col-span-1 md:col-span-1 ">
                    <TopProducts />
                </div>
                <div className="col-span-1 md:col-span-1 ">
                    <ProfitStatic />
                </div>

            </div>

        </div>
    )
}