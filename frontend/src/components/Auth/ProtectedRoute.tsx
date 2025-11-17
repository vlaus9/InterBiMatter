import { useAppSelector } from "../../app/hooks"

interface IProtectedRouteProps {
    children: React.ReactNode
    fallback?: React.ReactNode
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({
    children, 
    fallback = <div>Пожалуйста, зарегистрируйтесь...</div>
}) => {
    
    const { user } = useAppSelector((state) => state.authSlice)

    if (!user) {
        return (
            <>
                { fallback }
            </>
        )}

        return (
            <>
                { children }
            </>
        )
}

export default ProtectedRoute