import { motion } from "framer-motion"
import { AnimateVariants } from "../Auth/animate/AnimateVariants"
import { SmartButtonDataAttribut, SmartButtonDataProfile } from "../SmartButton/data/SmartButtonData"
import { useAppSelector } from "../../app/hooks"
import ModelViewer from "../ModelViewer/ModelViewer"
import ModalWindow from "../ModalWindow/ModalWindow"
import SmartButton from "../SmartButton/SmartButtonComponent"
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute"


const RouteProject: React.FC = () => {

    const project = useAppSelector((state) => state.projectSlice.project)

    // if (!project) {
    //    return <div>Проект отсутствует</div> 
    // }
    
    const modelUrl = project?.modelUrl
    console.log(modelUrl)

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

                <ModelViewer modelUrl="http://localhost/uploads/2CylinderEngine.gltf"/>

                <div className='absolute flex flex-col w-auto left-[1vw] top-[80px]'>

                  <div className='absolute rounded-[20px] top-[0] w-[70px] bg-[var(--button-group-primary-bg)] h-full shadow-[0_0_0_2px_#878585d6]'> 
                  </div>

                  {SmartButtonDataAttribut.map((el) => {
                    return (
                            <div key={el.id}>
                            <SmartButton config={el}/>
                            </div>
                            )
                  })}                  
                </div>

                <div className='absolute w-auto right-[1vw] top-[80px]'>
                    <div className='absolute rounded-[20px] right-[0] top-[0] w-[70px] bg-[var(--button-group-primary-bg)] h-full shadow-[0_0_0_2px_#878585d6]'> 
                    </div>
                    <SmartButton config={SmartButtonDataProfile[0]} />
                </div>

                <ModalWindow />
        </motion.div>
    </ProtectedRoute>
    )
}

export default RouteProject