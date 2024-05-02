import { useMutation, useQuery } from "@tanstack/react-query";
import useQueryConfig from "../../../../hooks/useQueryConfig";
import Product from "../../../ProductList/components/Product";
import shopApi from "../../../../apis/shop.api";
import ProductComponent from "./ProductComponent";
import Button from "../../../../components/Button";
import { useMemo, useState } from "react";
import Modal from "react-modal"
import { FormProvider, useForm } from "react-hook-form";
import Input from "../../../../components/Input";
import InputFile from "../../../../components/InputFile";
import { toast } from "react-toastify";

export default function ProductShop() {
    const [file, setFile] = useState<File>()

    const [linkFile, setLinkFile] = useState<string[]>([]);
    const queryConfig = useQueryConfig()
    const [isOpen, setIsOpen] = useState(false)

    const previewImage = useMemo(() => {
        return file ? URL.createObjectURL(file) : ''
    }, [file])

    const { data: productsData, refetch } = useQuery({
        queryKey: ['productShop'],
        queryFn: () => {
            return shopApi.getProduct()
        },
        // keepPreviousData: true,
    })

    const addImageMutation = useMutation({
        mutationFn: shopApi.addImageProduct,
        // onSuccess: (data) => {
        //     refetch()
        //     toast.success(data.data.message, {
        //         position: 'top-center',
        //         autoClose: 1000
        //     })
        // }
    })

    const createProductMutation = useMutation({
        mutationFn: shopApi.createProduct,

    })
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
            padding: 20,
            borderRadius: 10,
            borderColor: 'orange'
        },
    }
    const methods = useForm<any>({
        defaultValues: {
            title: '',
            weight: '',
            quantity: '',
            description: '',
            originalPrice: '',
            sellingPrice: '',
            titleDetail: '',
            desDetail: ''
        },
        // resolver: yupResolver(profileSchema)
    })
    const {
        register,
        control,
        formState: { errors },
        handleSubmit,
        setValue,
        watch,
        getValues,
        setError
    } = methods

    const url = 'https://image-ecommerce.up.railway.app/'

    const handleChangeFile = async (file?: File) => {
        if (file) {
            try {
                const formData = new FormData();
                formData.append('imageFile', file);
                const response = await addImageMutation.mutateAsync(formData);
                console.log("res", response);
                setLinkFile([...linkFile, response.data])
            } catch (error) {
                console.error("Error uploading image:", error);
            }
        }
        setFile(file);

    };


    const onSubmit = handleSubmit((data: any) => {
        const body = {
            title: data.title,
            weight: data.weight,
            quantity: data.quantity,
            description: data.description,
            originalPrice: data.originalPrice,
            sellingPrice: data.sellingPrice,
            productDescriptionDetails: [
                {
                    title: data.titleDetail,
                    description: data.descriptionDetail
                }
            ],
            linkImages: linkFile
        }
        createProductMutation.mutate(body, {
            onSuccess: (response) => {
                toast.success('Thành công', {
                    position: 'top-center',
                    autoClose: 1000
                })
                refetch()
                setIsOpen(!isOpen)
            }
        })
    })

    return (
        <div className='container'>
            <div className="flex justify-center my-5">
                <Button
                    onClick={() => {
                        setIsOpen(true)
                    }}
                    className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                >
                    Thêm sản phẩm
                </Button>
            </div>
            {productsData && (
                <div className='grid grid-cols-12 gap-6'>
                    {/* <div className='col-span-3'>
                            <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
                        </div> */}
                    <div className='col-span-9'>
                        <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                            {productsData?.data.map((product: any) => (
                                <div className='col-span-1' key={product.id}>
                                    <ProductComponent product={product} />
                                </div>
                            ))}
                        </div>
                        {/* <Pagination queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} /> */}
                    </div>
                </div>
            )}
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <FormProvider {...methods}>
                    <form className='mt-2 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'> {/* Thay đổi từ flex thành grid */}
                            <div className='mt-2 flex flex-col flex-wrap sm:flex-row '>
                                <div className='truncate pt-3 capitalize sm:text-left w-2/6'>Tên sản phẩm</div>
                                <div className='sm:pl-5 w-4/6'>
                                    <Input
                                        classNameInput='w-full justify-items-end rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                                        name='title'
                                        placeholder='Tên sản phẩm'
                                        register={register}
                                    />
                                </div>
                            </div>
                            <div className='mt-2 flex flex-col flex-wrap sm:flex-row '>
                                <div className='truncate pt-3 capitalize sm:text-left w-2/6'>Số lượng</div>
                                <div className='sm:pl-5 w-4/6'>
                                    <Input
                                        classNameInput='w-full justify-items-end rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                                        name='quantity'
                                        placeholder='Số lượng'
                                        register={register}
                                    />
                                </div>
                            </div>
                            <div className='mt-2 flex flex-col flex-wrap sm:flex-row '>
                                <div className='truncate pt-3 capitalize sm:text-left w-2/6'>Khối lượng</div>
                                <div className='sm:pl-5 w-4/6'>
                                    <Input
                                        classNameInput='w-full justify-items-end rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                                        name='weight'
                                        placeholder='Khối lượng'
                                        register={register}
                                    />
                                </div>
                            </div>
                            <div className='mt-2 flex flex-col flex-wrap sm:flex-row '>
                                <div className='truncate pt-3 capitalize sm:text-left w-2/6'>Mô tả</div>
                                <div className='sm:pl-5 w-4/6'>
                                    <Input
                                        classNameInput='w-full justify-items-end rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                                        name='description'
                                        placeholder='Mô tả'
                                        register={register}
                                    />
                                </div>
                            </div>
                            <div className='mt-2 flex flex-col flex-wrap sm:flex-row '>
                                <div className='truncate pt-3 capitalize sm:text-left w-2/6'>Giá gốc</div>
                                <div className='sm:pl-5 w-4/6'>
                                    <Input
                                        classNameInput='w-full justify-items-end rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                                        name='originalPrice'
                                        placeholder='Giá gốc'
                                        register={register}
                                    />
                                </div>
                            </div>
                            <div className='mt-2 flex flex-col flex-wrap sm:flex-row '>
                                <div className='truncate pt-3 capitalize sm:text-left w-2/6'>Giá bán</div>
                                <div className='sm:pl-5 w-4/6'>
                                    <Input
                                        classNameInput='w-full justify-items-end rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                                        name='sellingPrice'
                                        placeholder='Giá bán'
                                        register={register}
                                    />
                                </div>
                            </div>
                            <div className='mt-2 flex flex-col flex-wrap sm:flex-row '>
                                <div className='truncate pt-3 capitalize sm:text-left w-2/6'>Tiêu Đề </div>
                                <div className='sm:pl-5 w-4/6'>
                                    <Input
                                        classNameInput='w-full justify-items-end rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                                        name='titleDetail'
                                        placeholder='Tiêu đề'
                                        register={register}
                                    />
                                </div>
                            </div>
                            <div className='mt-2 flex flex-col flex-wrap sm:flex-row '>
                                <div className='truncate pt-3 capitalize sm:text-left w-2/6'>Mô tả chi tiết</div>
                                <div className='sm:pl-5 w-4/6'>
                                    <Input
                                        classNameInput='w-full justify-items-end rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                                        name='desDetail'
                                        placeholder='Mô tả chi tiết'
                                        register={register}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col items-center'>
                                <div className='my-5 h-24 w-24'>
                                    <img
                                        src={previewImage}
                                        alt=''
                                        className='h-full w-full rounded-full object-cover'
                                    />
                                </div>
                                <InputFile onChange={handleChangeFile} />
                            </div>
                            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
                                <div className='truncate pt-3 capitalize sm:text-right' />
                                <div className='sm:pl-5'>
                                    <Button
                                        className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                                        type='submit'
                                    >
                                        Thêm
                                    </Button>
                                </div>
                            </div>
                        </div>


                    </form>
                </FormProvider>

            </Modal>
        </div>
    )
}

