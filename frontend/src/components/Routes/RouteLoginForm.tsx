import { motion } from "framer-motion"
import { AnimateVariants } from "../Auth/animate/AnimateVariants"
import LoginForm from "../Auth/LoginForm"


const RouteLoginForm: React.FC = () => {
    return (
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
            <LoginForm />
        </motion.div>
    )
}

export default RouteLoginForm