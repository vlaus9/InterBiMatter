import { useState } from "react"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import axios from "axios"
import { createProject, cleanError } from "./slices/projectSlice"
import './styles/castomInputFileProject.css'

const CreateProjectForm: React.FC = () => {
    
    const [nameProject, setNameProject] = useState<string>('')
    const [filePath, setFilePath] = useState<string>('')
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.authSlice)


    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault()

        try {

            if (!nameProject || !filePath) {
                dispatch(cleanError())
                return
            }


        const result = await dispatch(createProject({ name: nameProject, autor: user.user?.name as string, modelPath: filePath})).unwrap()
        } catch (error) {
            console.log('Ошибка создания проекта', error)
        }
        
        // if (result) {
        //     Navigate()
        // }

    }    

    return (
        <div className='absolute flex justify-center items-center w-full h-full bg-black/30 backdrop-blur-xl'>
            <div className='w-[800px] min-w-[400px] h-[600px] min-h-[200px] bg-[var(--bg-primary)] border-[2px] border-[var(--button-group-primary-bg)] m-[30px] rounded-[15px]'>
                <div className='flex justify-center items-center h-[80px]'>
                    <h1 className='text-[var(--text-primary)] text-[26px] mb-[10px]' style={{ fontWeight: 800 }}>Создать проект</h1>
                </div>
                <form className='h-[70%] flex flex-col justify-center items-center'>
                    <div className='mb-[20px]'>
                        <label htmlFor='nameProject' className='mb-[10px] mr-[50px] mt-[10px] text-[18px] text-[var(--text-primary)]' >Название проекта</label>
                        <input id='nameProject' type='text' value={nameProject} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNameProject(e.target.value)} required className='w-[300px] h-[45px] p-[8px] border border-[black] bg-[var(--button-group-primary-bg)] outline-[var(--button-group-primary-bg)] rounded-[4px] text-[var(--text-primary)]'></input>
                    </div>
                    <div className='border flex items-center '>
                        <h3>Файл модели</h3>
                        <label htmlFor="fileProject" className='flex w-[300px] h-[45px] rounded-[4px] bg-[var(--button-group-primary-bg)] justify-center items-center border mb-[10px] mt-[10px]'>
                            Загрузить файл модели
                        </label>
                        <input id='fileProject' type='file' required accept='.gltf' className='hidden-input'></input>
                    </div>
                    
                </form>

            </div>
        </div>
    )
} 


export default CreateProjectForm