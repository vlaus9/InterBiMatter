import { useState } from 'react'
import { useAppSelector } from '../../app/hooks'
import AddFileToProjectForm from '../AddFileToProjectForm/AddFileToProjectForm'
import { CloseOutlined } from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimateVariants } from '../Auth/animate/AnimateVariants'


const ProjectPage: React.FC = () => {

    const selectProject = useAppSelector((state) => state.projectPage)
    const [isOpenAddFileWindow, setIsOpenAddFileWindow] = useState<boolean>(false)


    return (
        <div className='flex flex-col items-center w-screen h-screen bg-(--bg-primary)'>
            <div className='w-[80%] mt-[50px]'>
                <h1 className='text-[28px] text-(--text-primary)]' style={{fontWeight: '800'}}>Проект</h1>
            </div>
            <div className='w-[80%] mt-10'>
                <span className='flex gap-5 text-[20px] text-(--text-primary)]'>
                    <h1>Название:</h1>
                    <h1 style={{fontWeight: '800'}}>{selectProject.name}</h1>
                </span>
                <span className='flex gap-5 text-[20px] text-(--text-primary)]'>
                    <h1>Активная версия:</h1>
                    {/* <h1 style={{fontWeight: '800'}}>{user?.email}</h1> */}
                </span>
            </div>
            
            <div className='w-[80%] h-[60%] mt-10 rounded-[15px] bg-(--button-group-primary-bg)] border-2 border-[#808080ff]'>
                {/* СЮДА СПИСОК ВЕРСИЙ */}
                {selectProject.versions.map((version) => {
                   return (
                    <div key={version.id}>
                        <h1>{`${version.filePath}`}</h1>
                        <h1>{`${version.id}`}</h1>
                        <h1>{`${version.date}`}</h1>
                    </div>
                   ) 
                })}
            </div>
            <button onClick={() => setIsOpenAddFileWindow(true)}>
                Добавить файл
            </button>

            <AnimatePresence mode='wait'>
                {isOpenAddFileWindow && 
                    <>
                        <AddFileToProjectForm />
                        <motion.div
                            initial={AnimateVariants.createProjectFormVariant.initial}
                            animate={AnimateVariants.createProjectFormVariant.in}
                            exit={AnimateVariants.createProjectFormVariant.out}
                            >   
                            <CloseOutlined onClick={() => setIsOpenAddFileWindow(false)} style={{color: 'white'}} className='absolute right-[30px] top-5 scale-[1.3] text-(--text-primary) cursor-pointer hover:scale-[1.4] transition'/>
                        </motion.div>
                    </>}
            </AnimatePresence>
            
            
        </div>
    )
}

export default ProjectPage