import { useState } from "react"
import { useNavigate } from "react-router"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { createProject, cleanError } from "./slices/projectSlice"
import { motion } from "framer-motion"
import { AnimateVariants } from "../Auth/animate/AnimateVariants"

const CreateProjectForm: React.FC = () => {
    
    const [nameProject, setNameProject] = useState<string>('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [fileName, setFileName] = useState<string>('')
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.authSlice)
    const userName = user.user?.name
    const navigate = useNavigate()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setSelectedFile(file)
            setFileName(file.name)
        }
    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault()

        try {

            if (!nameProject || !selectedFile || !userName) {
                dispatch(cleanError())
                return
            }

            const formData = new FormData()
            formData.append('name', nameProject)
            formData.append('autor', userName)
            formData.append('modelFile', selectedFile)

        const result = await dispatch(createProject(formData)).unwrap()

        if (result) {
            navigate('/')
        }

        } catch (error) {
            console.log('Ошибка создания проекта', error)
        }
    }    

    return (
        <motion.div 
        initial={AnimateVariants.createProjectFormVariant.initial}
        animate={AnimateVariants.createProjectFormVariant.in}
        exit={AnimateVariants.createProjectFormVariant.out}
        variants={{AnimateVariants}}
        className='absolute flex justify-center items-center w-full h-full bg-black/30 backdrop-blur-xl'>
            <div className='w-[800px] min-w-[400px] h-[600px] min-h-[200px] bg-[var(--bg-primary)] border-[2px] border-[var(--button-group-primary-bg)] m-[30px] rounded-[15px]'>
                <div className='flex justify-center items-center h-[80px]'>
                    <h1 className='text-[var(--text-primary)] text-[26px] mb-[10px]' style={{ fontWeight: 800 }}>Создание проекта</h1>
                </div>
                <form onSubmit={handleSubmit} className='h-[80%] flex flex-col justify-center items-center'>
                    <div className='mb-[20px] w-[600px] flex justify-between items-center'>
                        <label htmlFor='nameProject' className='mb-[10px] mt-[10px] text-[18px] text-[var(--text-primary)]' >Название проекта</label>
                        <input id='nameProject' type='text' placeholder='Введите название проекта...' value={nameProject} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNameProject(e.target.value)} required className='w-[300px] h-[45px] p-[8px] border border-[black] bg-[var(--button-group-primary-bg)] outline-[var(--button-group-primary-bg)] rounded-[4px] text-[var(--text-primary)] placeholder:text-center placeholder:text-[black] placeholder:opacity-[0.5]'></input>
                    </div>
                    <div className='flex justify-between items-center w-[600px] '>
                        <h3 className='text-[18px] text-[var(--text-primary)]'>Файл модели</h3>

                        {!selectedFile ?
                            <>
                                <label htmlFor="fileProject" className='flex rounded-[4px] px-[15px] ml-[50px] w-[300px] h-[45px] bg-[var(--button-group-primary-bg)] justify-center items-center border cursor-pointer hover:border-[#d0cfcfff] hover:border-[2px] transition-all'>
                                Загрузить файл модели
                                </label>
                                <input id='fileProject' type='file' accept='.gltf' className='hidden' onChange={handleFileChange}></input>
                            </>
                        :
                            <div className='flex flex-col justify-center gap-[10px]'>
                                <label htmlFor="fileProject" className='flex rounded-[4px] px-[15px] w-[300px] h-[45px] bg-[var(--button-group-primary-bg)] justify-center items-center border cursor-pointer hover:border-[#d0cfcfff] hover:border-[2px] transition-all'>
                                Выбрать другой файл
                                </label>
                                <input id='fileProject' type='file' accept='.gltf' className='hidden' onChange={handleFileChange}></input>
                                <h3 className='w-[300px] text-[16px] text-center'>Выбран файл: {fileName}</h3>
                            </div>
                        }
                    </div>
                    <div className='mt-[80px]'>
                        <button type='submit' className='py-[10px] px-[15px] border rounded-[4px] bg-[var(--button-group-primary-bg)] hover:bg-[#9f9e9eff] transition-all cursor-pointer'>
                            <h3 className='text-[18px]'>Создать проект</h3>
                        </button>
                    </div>
                    
                </form>

            </div>
        </motion.div>
    )
} 


export default CreateProjectForm