import { Link } from 'react-router-dom'
import ProductRating from '../../../../components/ProductRating'
import path from '../../../../constants/path'
import { Product as ProductType } from '../../../../types/product.type'
import { formatCurrency, formatNumberToSocialStyle, generateNameId } from '../../../../utils/utils'
import Button from '../../../../components/Button'
import { useMutation } from '@tanstack/react-query'
import shopApi from '../../../../apis/shop.api'
import { toast } from 'react-toastify'

interface Props {
    product: ProductType
}

export default function ProductComponent({ product }: Props) {
    const setOnSaleMutation = useMutation({
        mutationFn: shopApi.setOnSale,
        // onSuccess: (data) => {
        //     refetch()
        //     toast.success(data.data.message, {
        //         position: 'top-center',
        //         autoClose: 1000
        //     })
        // }
    })
    const handleSale = () => {
        setOnSaleMutation.mutate(product.id, {
            onSuccess: (response) => {
                toast.success('Thành công', {
                    position: 'top-center',
                    autoClose: 1000
                })
                console.log(response)
            },
            onError: (err) => {
                toast.error('Thất bại')
            }
        })
    }
    const url = 'https://image-ecommerce.up.railway.app'
    return (
        <div>
            <div className='overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.04rem] hover:shadow-md'>
                <div className='relative w-full pt-[100%]'>
                    <img
                        src={`${url + product.linkImages[0]}`}
                        alt={product.title}
                        className='absolute left-0 top-0 h-full w-full bg-white object-cover'
                    />
                </div>
                <div className='overflow-hidden p-2'>
                    <div className='min-h-[2rem] text-xs line-clamp-2'>{product.title}</div>
                    <div className='mt-3 flex items-center'>
                        <div className='max-w-[50%] truncate text-gray-500 line-through'>
                            <span className='text-xs'>₫</span>
                            <span className='text-sm'>{formatCurrency(product.originalPrice)}</span>
                        </div>
                        <div className='ml-1 truncate text-orange'>
                            <span className='text-xs'>₫</span>
                            <span className='text-sm'>{formatCurrency(product.sellingPrice)}</span>
                        </div>
                    </div>
                    <div className='mt-3 flex items-center justify-end'>
                        <ProductRating rating={product.rate} />
                        <div className='ml-2 text-sm'>
                            <span>{formatNumberToSocialStyle(product.quantitySold)}</span>
                            <span className='ml-1'>Đã bán</span>
                        </div>
                    </div>
                    {product.censorship === "PASS" ? (
                        <div className='mt-3 flex items-center justify-end'>

                            <div className='ml-2 text-sm'>
                                <span className='ml-1'>Đang bán</span>
                            </div>
                        </div>
                    ) : (
                        <Button
                            className={`mt-5 flex h-8 w-20  items-center justify-center bg-orange text-sm text-white hover:bg-orange-600 sm:ml-4 sm:mt-0 rounded-md`}
                            onClick={handleSale}
                        >
                            Đăng bán
                        </Button>
                    )}

                </div>
            </div>
        </div>
    )
}