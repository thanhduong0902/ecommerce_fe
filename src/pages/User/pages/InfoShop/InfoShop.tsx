import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import InputFile from "../../../../components/InputFile";
import { Fragment } from "react/jsx-runtime";
import InputNumber from "../../../../components/InputNumber";
import { UserSchema } from "../../../../utils/rules";
import { useMutation, useQuery } from "@tanstack/react-query";
import shopApi from "../../../../apis/shop.api";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function InfoShop() {
    

    const { data: shopData, refetch } = useQuery<any>({
        queryKey: ['shop'],
        queryFn: () => {
            return shopApi.getShop();
        }
    });

    const methods = useForm<any>({
        defaultValues: {
            nameShop: '',
            city: '',
            district: '',
            ward: '',
            detail: '',
            linkImageAvatarShop: '',
            linkImageShop: ''
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
    useEffect(() => {
        if (shopData && shopData.data !== "") {
            setValue('nameShop', shopData.data.nameShop)
            setValue('city', shopData.data.addressShop.city)
            setValue('district', shopData.data.addressShop.district)
            setValue('ward', shopData.data.addressShop.ward)
            setValue('detail', shopData.data.addressShop.detail)
            setValue('linkImageShop', shopData.data.linkImageShop)
            setValue('linkImageAvatarShop', shopData.data.linkImageAvatarShop)
            // setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
        }
    }, [shopData, setValue])

    const createShopMutation = useMutation({
        mutationFn: shopApi.createShop,
        // onSuccess: (data) => {
        //     refetch()
        //     toast.success(data.data.message, {
        //         position: 'top-center',
        //         autoClose: 1000
        //     })
        // }
    })

    const onSubmit = handleSubmit(data => {
        const body = {
            nameShop: data.nameShop,
            addressShop: {
                city: data.city,
                district: data.district,
                ward: data.ward,
                detail: data.detail,
            }

            // linkImageAvatarShop: '',
            // linkImageShop: ''
        }
        createShopMutation.mutate(body, {
            onSuccess: (response) => {
                console.log("response", response)
                toast.success('Thành công', {
                    position: 'top-center',
                    autoClose: 1000
                })
                refetch()
            }
        })
    })



    return (
        <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
            <div className='border-b border-b-gray-200 py-6'>
                <h1 className='text-lg font-medium capitalize text-gray-900'>{shopData && shopData?.data !== "" ? "Thông tin Shop" : "Tạo mới Shop"} </h1>
            </div>
            <FormProvider {...methods}>
                <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
                    <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
                        <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
                            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Tên</div>
                            <div className='sm:w-[80%] sm:pl-5'>
                                <Input
                                    classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                                    name='nameShop'
                                    placeholder='Tên'
                                    register={register}
                                />
                            </div>
                        </div>
                        <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
                            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Tỉnh/thành phố</div>
                            <div className='sm:w-[80%] sm:pl-5'>
                                <Input
                                    classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                                    name='city'
                                    placeholder='Thành phố'
                                    register={register}
                                />
                            </div>
                        </div>
                        <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
                            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Quận/Huyện</div>
                            <div className='sm:w-[80%] sm:pl-5'>
                                <Input
                                    classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                                    name='district'
                                    placeholder='Quận/Huyện'
                                    register={register}
                                />
                            </div>
                        </div>
                        <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
                            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Phường/xã</div>
                            <div className='sm:w-[80%] sm:pl-5'>
                                <Input
                                    classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                                    name='ward'
                                    placeholder='Phuong/Xa'
                                    register={register}
                                />
                            </div>
                        </div>
                        <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
                            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Chi tiết</div>
                            <div className='sm:w-[80%] sm:pl-5'>
                                <Input
                                    classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                                    name='detail'
                                    placeholder='Chi tiết'
                                    register={register}
                                />
                            </div>
                        </div>
                        {shopData && shopData?.data == "" && (
                            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
                                <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right' />
                                <div className='sm:w-[80%] sm:pl-5'>
                                    <Button
                                        className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                                        type='submit'
                                    >
                                        Thêm
                                    </Button>
                                </div>
                            </div>
                        )}

                    </div>
                    {/* <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
                        <div className='flex flex-col items-center'>
                            <div className='my-5 h-24 w-24'>
                                <img
                                    // src={previewImage || getAvatarUrl(avatar)}
                                    alt=''
                                    className='h-full w-full rounded-full object-cover'
                                />
                            </div>
                            <InputFile
                            // onChange={handleChangeFile} 
                            />
                            <div className='mt-3 text-gray-400'>
                                <div>Dụng lượng file tối đa 1 MB</div>
                                <div>Định dạng:.JPEG, .PNG</div>
                                In
                            </div>
                        </div>
                    </div> */}
                </form>
            </FormProvider>
        </div>
    )
}