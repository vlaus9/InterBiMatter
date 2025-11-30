import { motion } from "framer-motion"
import { AnimateVariants } from "../Auth/animate/AnimateVariants"


const Splash: React.FC = () => {
    return (
        <motion.div
            key='splash'
            initial='initial'
            animate='in'
            exit='out'
            variants={AnimateVariants.startSplashVariants}
            className='fixed inset-0 flex items-center justify-center'
            style={{backdropFilter: 'blur(20px)', background: 'rgba(0,0,0,7)'}}>
            <motion.h1
                variants={AnimateVariants.startTextVariants}
                initial="initial"
                animate="in"
                exit="out"
                className='text-[76px] text-[var(--text-primary)] whitespace-nowrap overflow-hidden'
                style={{ fontWeight: '700' }}>
                  BiMatter
            </motion.h1>
        </motion.div>
    )
}

export default Splash