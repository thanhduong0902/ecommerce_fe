import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, Schema } from '../../utils/rules'
import { useMutation } from '@tanstack/react-query'
import authApi from '../../apis/auth.api'
import Button from '../../components/Button'
// import { isAxiosUnprocessableEntityError } from '../utils/utils'
import { ErrorResponse } from '../../types/utils.types'
import Input from '../../components/Input'
import { useContext } from 'react'
import { AppContext } from '../../context/app.context'
import { Helmet } from 'react-helmet-async'

type FormData = Pick<Schema, 'username' | 'password'>
const loginSchema = schema.pick(['username', 'password'])

export default function Login() {
    const { setIsAuthenticated, setProfile } = useContext(AppContext)
    const navigate = useNavigate()
    const {
        register,
        setError,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver: yupResolver(loginSchema)
    })

    const loginMutation = useMutation({
        mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.login(body)
    })

    const onSubmit = handleSubmit((data) => {
        loginMutation.mutate(data, {
            onSuccess: (data) => {
                // console.log(data.data)
                setIsAuthenticated(true)
                const user = {
                    username: data.data.username,
                    email: data.data.email,
                    listRoles: data.data.listRoles
                }
                setProfile(user)
                if (data.data.listRoles.includes("ROLE_MODERATOR")) {
                    navigate('/moderator')
                }
                else {
                    navigate('/')
                }
            },
            onError: (error) => {
                console.log(error)
            }
        })
    })

    return (
        <div className='bg-orange'>
            <Helmet>
                <title>Đăng nhập | Shopee Clone</title>
                <meta name='description' content='Đăng nhập vào dự án Shopee Clone' />
            </Helmet>
            <div className='container'>
                <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
                    <div className='lg:col-span-2 lg:col-start-4'>
                        <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
                            <div className='text-2xl'>Đăng nhập</div>
                            <Input
                                name='username'
                                register={register}
                                type='input'
                                className='mt-8'
                                errorMessage={errors.username?.message}
                                placeholder='Email'
                            />
                            <Input
                                name='password'
                                register={register}
                                type='password'
                                className='mt-2'
                                classNameEye='absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]'
                                errorMessage={errors.password?.message}
                                placeholder='Password'
                                autoComplete='on'
                            />
                            <div className='mt-3'>
                                <Button
                                    type='submit'
                                    className='flex  w-full items-center justify-center bg-red-500 px-2 py-4 text-sm uppercase text-white hover:bg-red-600'
                                    isLoading={loginMutation.isPending}
                                    disabled={loginMutation.isPending}
                                >
                                    Đăng nhập
                                </Button>
                            </div>
                            <div className='mt-8 flex items-center justify-center'>
                                <span className='text-gray-400'>Bạn chưa có tài khoản?</span>
                                <Link className='ml-1 text-red-400' to='/register'>
                                    Đăng ký
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}