import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { loginUser, cleanError } from './slices/authSlice'
import { useNavigate } from 'react-router'

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const { loading, error, isAuth } = useAppSelector((state) => state.authSlice)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        return () => {
            dispatch(cleanError())
        }
    }, [dispatch])

    const handleSubmitLogin =  async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
        
            if (!email || !password) {
            dispatch(cleanError())
            return
        } 

        const result = await dispatch(loginUser({ email, password })).unwrap()

        if (result) {
            navigate('/')
        }
        } catch (error) {
            console.log('Login failed', error)
        }
        
    }


    return (
        <div className='flex flex-col items-center justify-center w-[100vw] h-[100vh] bg-[var(--bg-primary)]'>
            <form onSubmit={handleSubmitLogin} className='flex flex-col w-full items-center p-[10px]'>
                <h2 className='text-[var(--text-primary)] text-[24px] mb-[10px]' style={{fontWeight: '800'}}>Вход</h2>

                {error && (
                    <div className='text-[red] bg-[#ffe6e6] p-[10px] rounded-[4px] mb-[15px]'>
                        {error}
                    </div>
                )}

                <div className='mb-[5px]'>
                    <label htmlFor='email' className={'block mb-[10px] mt-[10px] text-[var(--text-primary)]'}>
                        Почта:
                    </label>
                    <input id='email' type='email' autoComplete='email' value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required className='w-[250px] p-[8px] border border-[black] rounded-[4px] outline-[var(--button-group-primary-bg)] text-[var(--text-primary)]' />
                </div>

                <div className='mb-[20px]'>
                    <label htmlFor='password' className='block mb-[10px] mt-[10px] text-[var(--text-primary)]'>
                        Пароль
                    </label>
                    <input id='password' type='password' autoComplete='current-password' value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required className='w-[250px] p-[8px] border border-[black] rounded-[4px] outline-[var(--button-group-primary-bg)] text-[var(--text-primary)]'/>
                </div>

                <button type='submit' disabled={loading} className={`w-[250px] mb-[10px] p-[10px] ${loading ? 'bg-[#ccc] cursor-not-allowed' : 'bg-[var(--button-group-primary-bg)] cursor-pointer'} rounded-[4px] `}>
                    {loading ? 'Входим...' : 'Войти'}
                </button>
            </form>
                <button onClick={() => navigate('/register')} className='w-[250px] p-[10px] bg-[var(--button-group-primary-bg)] cursor-pointer rounded-[4px]'>
                    Зарегистрироваться
                </button>
        </div>
    )
}

export default LoginForm