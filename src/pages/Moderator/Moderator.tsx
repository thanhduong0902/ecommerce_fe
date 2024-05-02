import { useMutation, useQuery } from "@tanstack/react-query"
import moderatorApi from "../../apis/moderator"
import { formatCurrency } from "../../utils/utils"
import { Product } from "../../types/product.type"
import Button from "../../components/Button"
import { toast } from "react-toastify"


export default function Moderator() {

    const { data: product, refetch } = useQuery({
        queryKey: ['productMode'],
        queryFn: () => {
            return moderatorApi.getWaitconfirm()

        }
    })
    const data = product?.data
    const url = 'https://image-ecommerce.up.railway.app'

    const confirmProductMutation = useMutation({
        mutationFn: moderatorApi.confirmProduct,

    })

    const rejectProductMutation = useMutation({
        mutationFn: moderatorApi.rejectProduct,

    })

    const handleConfirm = (productId: number) => {
        confirmProductMutation.mutate(productId, {
            onSuccess: (response) => {
                toast.success('Thành công', {
                    position: 'top-center',
                    autoClose: 1000
                })
                refetch()
            }
        })
    }

    const handleReject = (productId: number) => {
        rejectProductMutation.mutate(productId, {
            onSuccess: (response) => {
                toast.success('Thành công', {
                    position: 'top-center',
                    autoClose: 1000
                })
                refetch()
            }
        })
    }



    return (
        <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
            <div className='border-b border-b-gray-200 py-6'>
                <h1 className='text-lg font-medium capitalize text-orange'>Chờ duyệt</h1>
            </div>
            <>
                <div className='overflow-auto my-5'>
                    <div className='min-w-[1000px]'>
                        <div className='grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow'>
                            <div className='col-span-4'>
                                <div className='flex items-center'>
                                    <div className='flex-grow text-black'>Sản phẩm</div>
                                </div>
                            </div>
                            <div className='col-span-8'>
                                <div className='grid grid-cols-6 text-center'>
                                    <div className="col-span-1">Shop</div>
                                    <div className='col-span-2'>Đơn giá</div>
                                    <div className='col-span-1'>Số lượng</div>
                                    <div className='col-span-1'>Số tiền</div>
                                    <div className='col-span-1'>Thao tác</div>
                                </div>
                            </div>
                        </div>
                        {data && (
                            <div className='my-3 rounded-sm bg-white p-5 shadow'>
                                {data.map((purchase: Product) => (
                                    <div
                                        key={purchase.id}
                                        className='mb-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white px-4 py-5 text-center text-sm text-gray-500 first:mt-0'
                                    >
                                        <div className='col-span-4'>
                                            <div className='flex'>
                                                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                                                    {/* <input
                                                                type='checkbox'
                                                                className='h-5 w-5 accent-orange'
                                                                checked={purchase.checked}
                                                                onChange={handleCheck(index)}
                                                            /> */}
                                                </div>
                                                <div className='flex-grow'>
                                                    <div className='flex'>
                                                        <div
                                                            className='h-20 w-20 flex-shrink-0'
                                                        // to={`${path.home}${generateNameId({
                                                        //     name: purchase.product.title,
                                                        //     id: purchase.product.id
                                                        // })}`}
                                                        >
                                                            <img
                                                                className='h-20 w-20'
                                                                alt={purchase.title} src={`${url + purchase.linkImages}`} />
                                                        </div>
                                                        <div className='flex-grow px-2 pb-2 pt-1'>
                                                            <div
                                                                // to={`${path.home}${generateNameId({
                                                                //     name: purchase.product.title,
                                                                //     id: purchase.product.id
                                                                // })}`}
                                                                className='text-left line-clamp-2'
                                                            >
                                                                {purchase.title}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-span-8'>
                                            <div className='grid grid-cols-6 items-center'>
                                                <div className='col-span-1'>
                                                    <span>{purchase.shop.nameShop}</span>
                                                </div>
                                                <div className='col-span-2'>
                                                    <div className='flex items-center justify-center'>
                                                        <span className='text-gray-300 line-through'>
                                                            ₫{formatCurrency(purchase.originalPrice)}
                                                        </span>
                                                        <span className='ml-3'>₫{formatCurrency(purchase.sellingPrice)}</span>
                                                    </div>
                                                </div>
                                                <div className='col-span-1'>
                                                    <span>{purchase.quantity}</span>
                                                </div>
                                                <div className='col-span-1'>
                                                    <span className='text-orange'>
                                                        ₫{formatCurrency(purchase.sellingPrice * purchase.quantity)}
                                                    </span>
                                                </div>

                                                <div className='col-span-1'>
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
                                                        onClick={() => handleReject(purchase.id)}
                                                    >
                                                        Từ chối
                                                    </Button>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                ))}

                            </div>
                        )}
                    </div>
                </div>
            </>
        </div>
    )
}