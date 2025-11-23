import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useState, useEffect } from "react"
import { registerUser, cleanError } from "./slices/authSlice"


const RegisterForm: React.FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [name, setName ] = useState<string>('')
    const dispatch = useAppDispatch()
    const { loading, error } = useAppSelector((state) => state.authSlice)

    useEffect(() => {
        dispatch(cleanError())
    }, [dispatch])

    const handleSubmitRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!email || !password) {
            dispatch(cleanError())
            return
        } 

        dispatch(registerUser({ email, password, name }))
    }

    return (
        <>
            <form onSubmit={handleSubmitRegister} className={'flex flex-col items-center w-[500px] h-[500px] bg-[green]'}>
                <h2>Регистрация</h2>

                {error && (
                    <div className={'text-[red] bg-[#ffe6e6] p-[10px] rounded-[4px] mb-[15px]'}>
                        {error}
                    </div>
                )}

                <div className={'mb-15px'}>
                    <label htmlFor='email' className={'block mb-[5px]'}>
                        Почта:
                    </label>
                    <input id='email' type='email' value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required className={'w-[100%] p-[8px] border rounded-[4px]'} />
                </div>

                <div className='mb-[15px]'>
                    <label htmlFor='password' className='block mb=[5px]'>
                        Пароль
                    </label>
                    <input id='password' type='password' value={password} minLength={6} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required className={'w-[100%] p-[8px] border rounded-[4px]'}/>
                </div>
                <div className='mb-[15px]'>
                    <label htmlFor='password' className='block mb=[5px]'>
                        Имя
                    </label>
                    <input id='name' type='name' value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required className={'w-[100%] p-[8px] border rounded-[4px]'}/>
                </div>

                <button type='submit' disabled={loading} className={`w-[40%] p-[10px] ${loading ? 'bg-[#ccc] cursor-not-allowed' : 'bg-[#007bff] cursir-pointer'} rounded-[4px] `}>
                    {loading ? 'Регистрируем тебя...' : 'Зарегистрироваться'}
                </button>
            </form>
        </>
    )
} 

export default RegisterForm