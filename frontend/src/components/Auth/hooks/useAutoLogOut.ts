import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { logOut } from "../slices/authSlice"
import { useNavigate } from "react-router"

const useAutoLogOut = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { isAuth } = useAppSelector((state) => state.authSlice)

    useEffect(() => {
        const expirationTime = localStorage.getItem('tokenExpiration')

        if (!expirationTime || !isAuth) return
        
        const timeLeft = parseInt(expirationTime) - Date.now()

        const handleLogOut = () => {
            dispatch(logOut())
            navigate('/')
        }

        if (timeLeft <= 0) {
            handleLogOut()
            return
        }

        const timer = setTimeout(() => {
            handleLogOut()
        }, timeLeft)

        return () => clearTimeout(timer)

       }, [dispatch, navigate, isAuth])
}

export default useAutoLogOut