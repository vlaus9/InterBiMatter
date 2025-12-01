import { Navigate } from "react-router"
import { useAppSelector } from "../../app/hooks"

interface ProtectedRouteProps {
    children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {

    const { isAuth, loading } = useAppSelector((state) => state.authSlice)

    if (loading) {
        return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500">
            </div>
        </div>
        )
    }
    
    if (!isAuth) {
        return <Navigate to='/login' replace />
    }

    return <>{children}</>

}

export default ProtectedRoute