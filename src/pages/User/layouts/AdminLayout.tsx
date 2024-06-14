import React, { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import UserSideNav from '../components/UserSideNav';
import AdminSideNav from '../components/AdminSideNav';
import NavHeader from '../../../components/NavHeader';
import ProfitStatic from '../../Admin/ProfitStatic';
import TopProducts from '../../Admin/TopProducts';
import TopShop from '../../Admin/TopShop';
import OrderStatic from '../../Admin/OrderStatic';
import FeeStatic from '../../Admin/FeeStatic';
import './ChartStyle.css'; // Import file CSS của bạn
import Modal from "react-modal"
import { AppContext } from '../../../context/app.context';
const ZoomableComponent = ({ children }: any) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`zoom-container ${hovered ? 'hovered' : ''}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {children}
        </div>
    );
};

export default function AdminLayout() {
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-20%',
            transform: 'translate(-50%, -50%)',
            padding: 20,
            borderRadius: 10,
            borderColor: 'orange',
            width: 800,
            height: 500,
            opacity: 2
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState(null);

    const openModal = (component: any) => {
        setSelectedComponent(component);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedComponent(null);
    };
    return (
        <div className=''>
            <div className='bg-[linear-gradient(-180deg,#F181B3,#F6AECF)] p-5 pt-2 text-white'>
                <NavHeader />

            </div>
            <div className="grid grid-flow-row grid-cols-3 grid-rows-2 gap-4 p-2">
                <div
                    onClick={() => openModal(<OrderStatic />)}
                    className="col-span-2 md:col-span-2 bg-[linear-gradient(-180deg,#F181B3,#F6AECF)] rounded border ">
                    <OrderStatic />
                </div>
                <div className="col-span-1 md:col-span-1 rounded border">
                    <FeeStatic />
                </div>

                <div onClick={() => openModal(<TopShop />)} className="col-span-1 md:col-span-1 ">
                    <TopShop />
                </div>
                <div
                    onClick={() => openModal(<TopProducts />)}
                    className="col-span-1 md:col-span-1 ">
                    <TopProducts />
                </div>
                <div
                    onClick={() => openModal(<ProfitStatic />)}
                    className="col-span-1 md:col-span-1 ">
                    <ProfitStatic />
                </div>

            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Zoomed Component"
                style={customStyles}
            >
                <div className="zoomed-content">
                    {selectedComponent}
                </div>
            </Modal>
        </div>
    );
}
