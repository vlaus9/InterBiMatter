import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { loginUser, cleanError } from './slices/authSlice'

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const dispatch = useAppDispatch()
    const { loading, error } = useAppSelector((state) => state.authSlice)
    
    useEffect(() => {
        return () => {
            dispatch(cleanError())
        }
    }, [dispatch])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!email || !password) {
            dispatch(cleanError())
            return
        } 

        dispatch(loginUser({ email, password }))
    }

    return (
        <form onSubmit={handleSubmit} className={'flex flex-col items-center w-[500px] h-[500px] bg-[green]'}>
            <h2>Вход</h2>

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
                <input id='password' type='password' value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required className={'w-[100%] p-[8px] border rounded-[4px]'}/>
            </div>

            <button type='submit' disabled={loading} className={`w-[40%] p-[10px] ${loading ? 'bg-[#ccc] cursor-not-allowed' : 'bg-[#007bff] cursir-pointer'} rounded-[4px] `}>
                {loading ? 'Входим...' : 'Войти'}
            </button>
        </form>
    )
}

export default LoginForm