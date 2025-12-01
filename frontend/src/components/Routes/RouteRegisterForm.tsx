import { motion } from "framer-motion"
import { AnimateVariants } from "../Auth/animate/AnimateVariants"
import RegisterForm from "../Auth/RegisterForm"
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute"

const RouteRegisterForm: React.FC = () => {
    return (
        <ProtectedRoute>
            <motion.div
                initial='initial'
                animate='in'
                exit='out'
                variants={AnimateVariants.PageVariants}
                style={{
                    perspective: 1200,
                    transformStyle: 'preserve-3d',
                    width: '100%',
                    height: '100%'
                }}>
                <RegisterForm />
            </motion.div>
        </ProtectedRoute>
    )
}

export default RouteRegisterForm