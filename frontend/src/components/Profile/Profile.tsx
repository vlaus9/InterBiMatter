import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { logOut } from "../Auth/slices/authSlice"

const Profile: React.FC = () => {
    const { user } = useAppSelector((state) => state.authSlice)
    const dispatch = useAppDispatch()

    const handleLogOut = () => {
        dispatch(logOut())
    }

    return (
        <div className={'w-[600px] h-[200px] bg-[blue]'}>
            <h2 className={'text-[white]'}>Профиль</h2>
            {user ? (
                <div className={'border p-[20px] rounded-[8px] bg-[#f9f9f9]'}>
                    <div>
                        <strong>
                            { user.email }
                        </strong>
                    </div>
                    <div>
                        <strong>
                            { user.id }
                        </strong>
                    </div>
                    <button onClick={handleLogOut}>
                        Выйти
                    </button>
                </div>
            ) : (
                <div>
                    <p>Пожалуйста, зарегистрируйтесь...</p>
                </div>
            )}
        </div>
    )
}

export default Profile