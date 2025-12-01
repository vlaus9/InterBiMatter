import { motion } from "framer-motion"
import { AnimateVariants } from "../Auth/animate/AnimateVariants"
import { SmartButtonData } from "../SmartButton/data/SmartButtonData"
import ModalWindow from "../ModalWindow/ModalWindow"
import SmartButton from "../SmartButton/SmartButtonComponent"
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute"


const RouteProject: React.FC = () => {
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
            }}
            className='relative'>
                <div className='absolute flex flex-col w-auto left-[1vw] top-[80px]'>

                  <div className='absolute rounded-[20px] top-[0] w-[70px] bg-[var(--button-group-primary-bg)] h-full shadow-[0_0_0_2px_#878585d6]'> 
                  </div>

                  {SmartButtonData.map((el) => {
                    return (
                            <div key={el.id}>
                            <SmartButton config={el}/>
                            </div>
                            )
                  })}
                  
                </div>

                <ModalWindow />
        </motion.div>
    </ProtectedRoute>
    )
}

export default RouteProject