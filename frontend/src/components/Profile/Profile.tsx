import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { logOut } from "../Auth/slices/authSlice"

const Profile: React.FC = () => {
    const { user } = useAppSelector((state) => state.authSlice)
    const dispatch = useAppDispatch()


    const handleLogOut = () => {
            dispatch(logOut())
    }

    return (
        <div className='flex flex-col items-center w-[100vw] h-[100vh] bg-[var(--bg-primary)]'>
            <div className='w-[80%] mt-[50px]'>
                <h1 className='text-[28px] text-[var(--text-primary)]' style={{fontWeight: '800'}}>Профиль</h1>
            </div>
            <div className='w-[80%] mt-[40px]'>
                <span className='flex gap-[20px] text-[20px] text-[var(--text-primary)]'>
                    <h1>Пользователь:</h1>
                    <h1 style={{fontWeight: '800'}}>{user?.name}</h1>
                </span>
                <span className='flex gap-[20px] text-[20px] text-[var(--text-primary)]'>
                    <h1>Логин:</h1>
                    <h1 style={{fontWeight: '800'}}>{user?.email}</h1>
                </span>
            </div>
            <div className='w-[80%] h-[60%] mt-[40px] rounded-[15px] bg-[var(--button-group-primary-bg)] border-[2px] border-[#808080ff]'>

            </div>

            <div className='w-[80%] mt-[40px] mb-[20px] flex justify-end'>
                <button onClick={handleLogOut} className='w-[200px] p-[10px] bg-[var(--button-group-primary-bg)] cursor-pointer rounded-[5px] border-[2px] border-[#808080ff]'>
                            Выйти
                </button>
            </div>
        </div>
        )
}

export default Profile
