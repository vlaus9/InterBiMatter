import { motion } from "framer-motion"
import { AnimateVariants } from "../Auth/animate/AnimateVariants"
import Profile from "../Profile/Profile"
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute"



const RouteProfile: React.FC = () => {
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
                <Profile />
            </motion.div>
        </ProtectedRoute>
    )
}

export default RouteProfile