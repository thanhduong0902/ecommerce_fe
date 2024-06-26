import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
// import categoryApi from 'src/apis/category.api'
import productApi from '../../apis/product.api'
import Pagination from '../../components/Pagination'
import useQueryConfig from '../../hooks/useQueryConfig'
import { ProductListConfig } from '../../types/product.type'
import AsideFilter from './components/AsideFilter/AsideFilter'
import Product from './components/Product/Product'
import SortProductList from './components/SortProductList'
import { useContext } from 'react'
import { AppContext } from '../../context/app.context'

export default function ProductList() {
    const queryConfig = useQueryConfig()

    const { searchValue } = useContext(AppContext)

    console.log(searchValue)

    const { data: productsData } = useQuery({
        queryKey: ['products', searchValue],
        queryFn: () => {
            return productApi.getProducts(searchValue)
        },
        // keepPreviousData: true,
        staleTime: 3 * 60 * 1000
    })
    // const { data: categoriesData } = useQuery({
    //     queryKey: ['categories'],
    //     queryFn: () => {
    //         return categoryApi.getCategories()
    //     }
    // })

    return (
        <div className='bg-gray-200 py-6'>
            <Helmet>
                <title>Trang chủ | Shopee Clone</title>
                <meta name='description' content='Trang chủ dự án Shopee Clone' />
            </Helmet>
            <div className='container'>
                {productsData && (
                    <div className='grid grid-cols-12 gap-6'>
                        {/* <div className='col-span-3'>
                            <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
                        </div> */}
                        <div className='col-span-9'>
                            {/* <SortProductList queryConfig={queryConfig} /> */}
                            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                                {productsData?.data.map((product: any) => (
                                    <div className='col-span-1' key={product.id}>
                                        <Product product={product} />
                                    </div>
                                ))}
                            </div>
                            {/* <Pagination queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} /> */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}