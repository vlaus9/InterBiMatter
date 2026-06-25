import { useState } from "react"
import { motion } from "framer-motion"
import { AnimateVariants } from "../Auth/animate/AnimateVariants"
import { SmartButtonDataAttribut, SmartButtonDataProfile } from "../SmartButton/data/SmartButtonData"
import { useAppSelector } from "../../app/hooks"
import ModelViewer from "../Model/ModelViewer"
import ModelViewerBMT from "../Model/ModelViewerBMT"
import ModalWindow from "../ModalWindow/ModalWindow"
import SmartButton from "../SmartButton/SmartButtonComponent"
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute"
import ModelPropertiesTable from "../Model/ModelPropertiesTableBMT/ModelPropertiesTable"


const RouteProject: React.FC = () => {

    const [isOpenModelPropertiesTable, setIsOpenModelPropertiesTable] = useState<boolean>(false)




    const project = useAppSelector((state) => state.projectSlice.project)
    if (!project) return
    const modelUrl = project.modelPath

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


                <div className={`relative w-screen ${isOpenModelPropertiesTable ? 'h-[60vh]' : 'h-screen'} transition-all ease-in-out duration-500`}>

                    <ModelViewerBMT />
                    {/* <ModelViewer modelUrl={modelUrl as string}/> */}

                    <div className='absolute flex flex-col w-auto left-[1vw] top-20'>

                    <div className='absolute rounded-[20px] top-0 w-17.5 bg-(--button-group-primary-bg) h-full shadow-[0_0_0_2px_#878585d6]'> 
                    </div>

                    {SmartButtonDataAttribut.map((el) => {
                        return (
                                <div key={el.id}>
                                <SmartButton config={el}/>
                                </div>
                                )
                    })}                  
                    </div>

                    <div className='absolute w-auto right-[1vw] top-20'>
                        <div className='absolute rounded-[20px] right-0 top-0 w-17.5 bg-(--button-group-primary-bg) h-full shadow-[0_0_0_2px_#878585d6]'> 
                        </div>
                        <SmartButton config={SmartButtonDataProfile[0]} />
                    </div>

                    <ModalWindow />

                    <div className='absolute bottom-20 flex bg-white gap-5'>
                        <button onClick={() => setIsOpenModelPropertiesTable(true)}>
                            CLICK
                        </button>
                        <button onClick={() => setIsOpenModelPropertiesTable(false)}>
                            noCLICK
                        </button>
                    </div>

                </div>

                <ModelPropertiesTable />

        </motion.div>
    </ProtectedRoute>
    )
}

export default RouteProject