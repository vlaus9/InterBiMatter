import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useState, useEffect } from "react"
import { registerUser, cleanError } from "./slices/authSlice"
import { useNavigate } from "react-router"


const RegisterForm: React.FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [name, setName ] = useState<string>('')
    const { loading, error, isAuth } = useAppSelector((state) => state.authSlice)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(cleanError())
    }, [dispatch])

    const handleSubmitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            if (!email || !password) {
            dispatch(cleanError())
            return
        } 

        const result = await dispatch(registerUser({ email, password, name })).unwrap()

        if (result) {
            navigate('/project')
        }
        } catch (error) {
            console.log('Register failed', error)
        }
        


    }


    return (
        <div className='flex items-center justify-center w-[100vw] h-[100vh] bg-[var(--bg-primary)]'>
            <form onSubmit={handleSubmitRegister} className='flex flex-col w-full items-center p-[10px]'>
                <h2 className='text-[var(--text-primary)] text-[24px] mb-[10px]' style={{ fontWeight: '900'}}>Регистрация</h2>

                {error && (
                    <div className={'text-[red] bg-[#ffe6e6] p-[10px] rounded-[4px] mb-[15px]'}>
                        {error}
                    </div>
                )}

                <div className='mb-[5px]'>
                    <label htmlFor='email' className='block mb-[10px] mt-[10px] text-[var(--text-primary)]'>
                        Почта:
                    </label>
                    <input id='email' type='email' autoComplete='email' value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required className='w-[250px] p-[8px] border border-[black] rounded-[4px] outline-[var(--button-group-primary-bg)] text-[var(--text-primary)]' />
                </div>

                <div className='mb-[5px]'>
                    <label htmlFor='password' className='block mb-[10px] mt-[10px] text-[var(--text-primary)]'>
                        Пароль
                    </label>
                    <input id='password' type='password' autoComplete='new-password' value={password} minLength={6} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required className='w-[250px] p-[8px] border border-[black] rounded-[4px] outline-[var(--button-group-primary-bg)] text-[var(--text-ptimary)]'/>
                </div>
                <div className='mb-[20px]'>
                    <label htmlFor='password' className='block mb-[10px] mt-[10px] text-[var(--text-primary)]'>
                        Имя
                    </label>
                    <input id='name' type='name' autoComplete='name' value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required className='w-[250px] p-[8px] border border-[black] rounded-[4px] outline-[var(--button-group-primary-bg)] text-[var(--text-primary)]'/>
                </div>

                <button  type='submit' disabled={loading} className={`w-[250px] mb-[10px] p-[10px] ${loading ? 'bg-[#ccc] cursor-not-allowed' : 'bg-[var(--button-group-primary-bg)] cursor-pointer'} rounded-[4px] `}>
                    {loading ? 'Регистрируем тебя...' : 'Зарегистрироваться'}
                </button>
            </form>
        </div>
    )
} 

export default RegisterForm