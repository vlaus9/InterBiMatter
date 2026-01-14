import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { logOut } from "../Auth/slices/authSlice"
import { useState } from "react"
import CreateProjectForm from "../CreateProjectForm/CreateProjectForm"
import { CloseOutlined } from '@ant-design/icons'
import { motion, AnimatePresence } from "framer-motion"
import { AnimateVariants } from "../Auth/animate/AnimateVariants"
import ProjectsList from "../ProjectsList/ProjectsList"

const Profile: React.FC = () => {
    const { user } = useAppSelector((state) => state.authSlice)
    const dispatch = useAppDispatch()
    const [createProjectActive, setCreateProjectActive] = useState<boolean>(false)

    const handleLogOut = () => {
            dispatch(logOut())
    }

    return (

        <div className='flex flex-col items-center w-[100vw] h-[100vh] bg-[var(--bg-primary)]'>
            <div className='w-[80%] mt-[50px]'>
                <h1 className='text-[28px] text-[var(--text-primary)]' style={{fontWeight: '800'}}>Профиль</h1>
            </div>
            <div className='w-[80%] mt-[40px]'>
                <span className='flex gap-[20px] text-[20px] text-[var(--text-primary)]'>
                    <h1>Пользователь:</h1>
                    <h1 style={{fontWeight: '800'}}>{user?.name}</h1>
                </span>
                <span className='flex gap-[20px] text-[20px] text-[var(--text-primary)]'>
                    <h1>Логин:</h1>
                    <h1 style={{fontWeight: '800'}}>{user?.email}</h1>
                </span>
            </div>
            
            <div className='w-[80%] h-[60%] mt-[40px] rounded-[15px] bg-[var(--button-group-primary-bg)] border-[2px] border-[#808080ff]'>
                <ProjectsList />
            </div>

            <div className='w-[80%] mt-[40px] mb-[20px] flex justify-between'>
                <button onClick={() => setCreateProjectActive(true)} className='w-[200px] p-[10px] bg-[var(--button-group-primary-bg)] text-[var(--text-primary)] text-[18px] cursor-pointer rounded-[5px] border-[2px] border-[#808080ff] transition-all hover:scale-[1.03]'>
                            Создать проект
                </button>
                <button onClick={handleLogOut} className='w-[200px] p-[10px] bg-[var(--button-group-primary-bg)] cursor-pointer rounded-[5px] border-[2px] border-[#808080ff] transition-all hover:scale-[1.03]'>
                            Выйти
                </button>
            </div>


            <AnimatePresence mode='wait'>
                { createProjectActive ? 
                <>
                    <CreateProjectForm />
                    <motion.div 
                        initial={AnimateVariants.createProjectFormVariant.initial}
                        animate={AnimateVariants.createProjectFormVariant.in}
                        exit={AnimateVariants.createProjectFormVariant.out}
                        >
                        <CloseOutlined onClick={() => setCreateProjectActive(false)} style={{color: 'white'}} className='absolute right-[30px] top-[20px] scale-[1.3] text-[var(--text-primary)] cursor-pointer hover:scale-[1.4] transition'/>
                    </motion.div>
                </> 
                : null }
            </AnimatePresence>

        </div>
        )
}

export default Profile
