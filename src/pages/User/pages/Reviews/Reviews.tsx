import { useMutation, useQuery } from "@tanstack/react-query"
import purchaseApi from "../../../../apis/purchase.api"
import { Link } from "react-router-dom"
import path from "../../../../constants/path"
import { generateNameId } from "../../../../utils/utils"
import Button from "../../../../components/Button"
import { useState } from "react"
import Modal from 'react-modal'
import { toast } from "react-toastify"

export default function Reviews() {

    const { data: purchasesInCartData, refetch } = useQuery({
        queryKey: ['reviews'],
        queryFn: () => {
            return purchaseApi.getReview()

        }
    })
    const purchasesInCart = purchasesInCartData?.data
    const url = 'https://image-ecommerce.up.railway.app'

    const [modalIsOpen, setIsOpen] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState({}); // State mới để lưu trữ thông tin của đơn hàng được chọn


    function openModal(purchase: any) {
        setIsOpen(true);
        setSelectedPurchase(purchase)
    }

    function closeModal() {
        setSelectedPurchase({}); // Xóa thông tin của đơn hàng được chọn khi modal đóng
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
    const [reviewContent, setReviewContent] = useState('');
    // State để lưu trữ đánh giá mức độ (tính từ 1 đến 5)
    const [rating, setRating] = useState(0);

    const addReviewMutation = useMutation({
        mutationFn: purchaseApi.addReview,
        // onSuccess: (data) => {
        //     refetch()
        //     toast.success(data.data.message, {
        //         position: 'top-center',
        //         autoClose: 1000
        //     })
        // }
    })

    const handleReview = () => {
        const body = {
            cartResponse: selectedPurchase,
            comment: reviewContent,
            star: rating
        }
        addReviewMutation.mutate(body, {
            onSuccess: (response) => {
                toast.success('Thành công', {
                    position: 'top-center',
                    autoClose: 1000
                })
                setIsOpen(!openModal)
            },
            onError: (err) => {
                toast.error('Thất bại')
            }
        })
    }

    return (
        <div>
            {
                purchasesInCart?.map((purchase: any) => (
                    <div key={purchase._id} className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm flex justify-between'>
                        <div className='flex '>Đơn hàng {purchase.id}</div>
                        <Link
                            to={`${path.home}${generateNameId({ name: purchase.product.title, id: purchase.product.id })}`}
                            className='flex'
                        >
                            <div className='flex-shrink-0'>
                                <img className='h-20 w-20 object-cover' src={`${url + purchase.product.linkImages}`} alt={purchase.product.name} />
                            </div>
                            <div className='ml-3 flex-grow overflow-hidden'>
                                <div className='truncate'>{purchase.product.title}</div>
                                <div className='mt-3'>x{purchase.quantity}</div>
                            </div>

                        </Link>

                        <div className='flex justify-end'>
                            <Button
                                className={`mt-5 flex h-10 w-40 px-5 items-center justify-center bg-orange text-sm uppercase text-white hover:bg-orange-600 sm:ml-4 sm:mt-0 rounded-md`}
                                onClick={() => openModal(purchase)}
                            >
                                Đánh giá
                            </Button>
                        </div>


                    </div>
                ))
            }
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                {selectedPurchase && ( // Kiểm tra nếu có thông tin đơn hàng được chọn, thì hiển thị modal
                    <>
                        <h2 className='mb-5 text-xl text-orange'>Đánh giá sản phẩm</h2>
                        <textarea
                            className='h-20 orange-border w-200'
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            placeholder="Nhập nội dung..."
                        />
                        <div className='my-10'>
                            <h2 className='mb-5 text-xl text-orange'>Mức độ </h2>
                            {[1, 2, 3, 4, 5].map((star, index) => (
                                <span
                                    key={index}
                                    onClick={() => setRating(star)}
                                    style={{ color: star <= rating ? 'gold' : 'gray', cursor: 'pointer' }}
                                >
                                    &#9733;
                                </span>
                            ))}
                        </div>
                        <Button
                            className={`mt-5 flex h-10 w-40 px-5 items-center justify-center bg-orange text-sm uppercase text-white hover:bg-orange-600 sm:ml-4 sm:mt-0 rounded-md`}
                            onClick={handleReview}
                        >
                            Gửi đánh giá
                        </Button>
                    </>
                )}
            </Modal>
        </div>
    )
}



