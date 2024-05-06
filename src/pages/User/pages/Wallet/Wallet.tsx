import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "../../../../components/Button";
import userApi from "../../../../apis/user.api";
import { formatCurrency } from "../../../../utils/utils";
import { useState } from "react";
import Modal from "react-modal"
import { toast } from "react-toastify";

export default function Wallet() {
    const queryClient = useQueryClient()
    const profileData = queryClient.getQueryData(["profile"]) as any;

    const { data: walletData, refetch } = useQuery({
        queryKey: ['wallet'],
        queryFn: () => userApi.checkBalance(profileData.data.id)
    });
    const [money, setMoney] = useState("");
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: 50,
            borderRadius: 10,
            borderColor: 'orange'
        },
    };
    const addMpneyMutation = useMutation({
        mutationFn: userApi.topUpMoney,

    })

    const handleTopup = () => {
        addMpneyMutation.mutate(Number(money), {
            onSuccess: (response) => {
                toast.success('Thành công', {
                    position: 'top-center',
                    autoClose: 1000
                })
                refetch()
                setIsOpen(!openModal)
            },
            onError: (err) => {
                toast.error('Thất bại')
            }
        })
    }
    return (
        <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
            <div className='border-b border-b-gray-200 py-6'>
                <h1 className='text-lg font-medium capitalize text-gray-900'>Ví Của Tôi</h1>
            </div>
            <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start'>
                <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
                    <div className='mt-2 flex items-center flex-wrap sm:flex-row'>
                        <span>Số dư ví</span>
                        <span className="ml-4 text-orange">{formatCurrency(walletData?.data?.balance)}₫</span>
                    </div>


                    <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
                        <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right' />
                        <div className='sm:w-[80%] sm:pl-5'>
                            <Button
                                className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                                type='button'
                                onClick={() => openModal()}
                            >
                                Nạp tiền
                            </Button>
                        </div>
                    </div>
                </div>

            </form>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div>
                    <h2>Số tiền nạp</h2>
                    <input
                        value={money}
                        onChange={(e) => setMoney(e.target.value)}
                        className="w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm" />
                    <Button
                        className='mt-4 flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                        type='button'
                        onClick={handleTopup}
                    >
                        Xác nhận
                    </Button>
                </div>
            </Modal>
        </div>
    )
}