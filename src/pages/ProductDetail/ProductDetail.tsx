import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import productApi from '../../apis/product.api'
import purchaseApi from '../../apis/purchase.api'
import { toast } from 'react-toastify'
import ProductRating from '../../components/ProductRating'
import QuantityController from '../../components/QuantityController'
import { purchasesStatus } from '../../constants/purchase'
import { Product as ProductType, ProductListConfig } from '../../types/product.type'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from '../..//utils/utils'
import Product from '../ProductList/components/Product'
import path from '../../constants/path'
import { Helmet } from 'react-helmet-async'
import moment from 'moment'
// import { convert } from 'html-to-text'

export default function ProductDetail() {
    const queryClient = useQueryClient()
    const [buyCount, setBuyCount] = useState(1)
    const { nameId } = useParams()
    const id = getIdFromNameId(nameId as string)
    const { data: productDetailData } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productApi.getProductDetail(id as string)
    })
    const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
    const [activeImage, setActiveImage] = useState('')
    const product = productDetailData?.data
    const imageRef = useRef<HTMLImageElement>(null)

    const queryConfig: ProductListConfig = {}

    const currentImages = useMemo(
        () => (product ? product.linkImages.slice(...currentIndexImages) : []),
        [product, currentIndexImages]
    )

    const { data: productsData } = useQuery({
        queryKey: ['products'],
        queryFn: () => {
            return productApi.getProducts()
        },
        staleTime: 3 * 60 * 1000,
        enabled: Boolean(product)
    })
    const navigate = useNavigate()
    useEffect(() => {
        if (product?.linkImages && product.linkImages.length > 0) {
            setActiveImage(product.linkImages[0])
        }
    }, [product])

    const next = () => {
        if (currentIndexImages[1] < (product as ProductType).linkImages.length) {
            setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
        }
    }

    const prev = () => {
        if (currentIndexImages[0] > 0) {
            setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
        }
    }
    const chooseActive = (img: string) => {
        setActiveImage(img)
    }

    // const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    //     const rect = event.currentTarget.getBoundingClientRect()
    //     const image = imageRef.current as HTMLImageElement
    //     const { naturalHeight, naturalWidth } = image
    //     // Cách 1: Lấy offsetX, offsetY đơn giản khi chúng ta đã xử lý được bubble event
    //     // const { offsetX, offsetY } = event.nativeEvent

    //     // Cách 2: Lấy offsetX, offsetY khi chúng ta không xử lý được bubble event
    //     const offsetX = event.pageX - (rect.x + window.scrollX)
    //     const offsetY = event.pageY - (rect.y + window.scrollY)

    //     const top = offsetY * (1 - naturalHeight / rect.height)
    //     const left = offsetX * (1 - naturalWidth / rect.width)
    //     image.style.width = naturalWidth + 'px'
    //     image.style.height = naturalHeight + 'px'
    //     image.style.maxWidth = 'unset'
    //     image.style.top = top + 'px'
    //     image.style.left = left + 'px'
    // }

    // const handleRemoveZoom = () => {
    //     imageRef.current?.removeAttribute('style')
    // }

    const handleBuyCount = (value: number) => {
        setBuyCount(value)
    }

    const addToCartMutation = useMutation({
        mutationFn: (product: { productId: number; quantity: number }) => purchaseApi.addToCart(product)
    });
    const addtoCart = (productId: number, quantity: number) => {
        addToCartMutation.mutate({ productId, quantity }, {
            onSuccess: (data) => {
                toast.success(data.data.message, {
                    autoClose: 1000
                })
                queryClient.invalidateQueries({
                    queryKey: [
                        'purchases',

                    ]
                })
            }
        })
    }

    const buyNow = async () => {
        // const res = await addToCartMutation.mutateAsync({
        //     buy_count: buyCount,
        //     product_id: product?._id as string
        // })

        // const purchase = res.data.data
        // navigate(path.cart, {
        //     state: {
        //         purchaseId: purchase._id
        //     }
        // })
    }

    if (!product) return null
    const url = 'https://image-production-cd47.up.railway.app/'


    return (
        <div className='bg-gray-200 py-6'>
            <Helmet>
                <title>{product.title} | Shopee Clone</title>
                {/* <meta
                    name='description'
                    content={convert(product.description, {
                        limits: {
                            maxInputLength: 150
                        }
                    })}
                /> */}
            </Helmet>
            <div className='container'>
                <div className='bg-white p-4 shadow'>
                    <div className='grid grid-cols-12 gap-9'>
                        <div className='col-span-5'>
                            <div
                                className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
                            // onMouseMove={handleZoom}
                            // onMouseLeave={handleRemoveZoom}
                            >
                                <img
                                    src={`${url + activeImage}`}
                                    alt={product.title}
                                    className='absolute left-0 top-0 h-full w-full bg-white object-cover'
                                    ref={imageRef}
                                />
                            </div>
                            <div className='relative mt-4 grid grid-cols-5 gap-1'>
                                <button
                                    className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                                    onClick={prev}
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        strokeWidth={1.5}
                                        stroke='currentColor'
                                        className='h-5 w-5'
                                    >
                                        <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                                    </svg>
                                </button>
                                {currentImages.map((img) => {
                                    const isActive = img === activeImage
                                    return (
                                        <div className='relative w-full pt-[100%]' key={img} onMouseEnter={() => chooseActive(img)}>
                                            <img
                                                src={`${url + img}`}
                                                alt={product.title}
                                                className='absolute left-0 top-0 h-full w-full cursor-pointer bg-white object-cover'
                                            />
                                            {isActive && <div className='absolute inset-0 border-2 border-orange' />}
                                        </div>
                                    )
                                })}
                                <button
                                    className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                                    onClick={next}
                                >
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        strokeWidth={1.5}
                                        stroke='currentColor'
                                        className='h-5 w-5'
                                    >
                                        <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className='col-span-7'>
                            <h1 className='text-xl font-medium uppercase'>{product.title}</h1>
                            <div className='mt-8 flex items-center'>
                                <div className='flex items-center'>
                                    <span className='mr-1 border-b border-b-orange text-orange'>{product.rate}</span>
                                    <ProductRating
                                        rating={product.rate}
                                        activeClassname='fill-orange text-orange h-4 w-4'
                                        nonActiveClassname='fill-gray-300 text-gray-300 h-4 w-4'
                                    />
                                </div>
                                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                                <div>
                                    <span>{formatNumberToSocialStyle(product.quantitySold)}</span>
                                    <span className='ml-1 text-gray-500'>Đã bán</span>
                                </div>
                            </div>
                            <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                                <div className='text-gray-500 line-through'>₫{formatCurrency(product.originalPrice)}</div>
                                <div className='ml-3 text-3xl font-medium text-orange'>₫{formatCurrency(product.sellingPrice)}</div>
                                <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                                    {rateSale(product.originalPrice, product.sellingPrice)} giảm
                                </div>
                            </div>
                            <div className='mt-8 flex items-center'>
                                <div className='capitalize text-gray-500'>Số lượng</div>
                                <QuantityController
                                    onDecrease={handleBuyCount}
                                    onIncrease={handleBuyCount}
                                    onType={handleBuyCount}
                                    value={buyCount}
                                    max={product.quantity}
                                />
                                <div className='ml-6 text-sm text-gray-500'>
                                    {product.quantity} có sẵn
                                </div>
                            </div>
                            <div className='mt-8 flex items-center'>
                                <button
                                    onClick={() => addtoCart(product.id, buyCount)}
                                    className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'
                                >
                                    <svg
                                        enableBackground='new 0 0 15 15'
                                        viewBox='0 0 15 15'
                                        x={0}
                                        y={0}
                                        className='mr-[10px] h-5 w-5 fill-current stroke-orange text-orange'
                                    >
                                        <g>
                                            <g>
                                                <polyline
                                                    fill='none'
                                                    points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeMiterlimit={10}
                                                />
                                                <circle cx={6} cy='13.5' r={1} stroke='none' />
                                                <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                                            </g>
                                            <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1='7.5' x2='10.5' y1={7} y2={7} />
                                            <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1={9} x2={9} y1='8.5' y2='5.5' />
                                        </g>
                                    </svg>
                                    Thêm vào giỏ hàng
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-8'>
                <div className='container'>
                    <div className=' bg-white p-4 shadow'>
                        <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>Mô tả sản phẩm</div>
                        <div className='mx-4 mb-4 mt-12 text-sm leading-loose'>
                            <div>{productDetailData.data.description}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-8'>
                <div className='container'>
                    <div className=' bg-white p-4 shadow'>
                        <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>Đánh giá</div>
                        {product.feedBacks?.map((item: any) => (
                            <div className='flex flex-col justify-center mb-5'>
                                <div>
                                    {item.comment}
                                </div>
                                <div>
                                    Thời gian: {moment(item.created).format('YYYY-MM-DD HH:mm:ss')}
                                </div>
                                <div>
                                    Khách hàng: {item.customer.name.lastName}
                                </div>
                                <div>
                                    {[1, 2, 3, 4, 5].map((star, index) => (
                                        <span
                                            key={index}
                                            style={{ color: star <= item.star ? 'gold' : 'white' }}
                                        >
                                            &#9733;
                                        </span>
                                    ))}
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            </div>

            <div className='mt-8'>
                <div className='container'>
                    <div className='uppercase text-gray-400'>CÓ THỂ BẠN CŨNG THÍCH</div>
                    {productsData && (
                        <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
                            {productsData.data.map((product) => (
                                <div className='col-span-1' key={product.id}>
                                    <Product product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}