import { motion } from 'framer-motion'
import { AnimateVariants } from '../Auth/animate/AnimateVariants'
import { useState } from 'react'

const AddFileToProjectForm: React.FC = () => {
    
    const [file, setFile] = useState<File>()
    const [version, setVersion] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            setFile(file)
        }
    }

    return (
        <motion.div
            initial='initial'
            animate='in'
            exit='out'
            variants={AnimateVariants.createProjectFormVariant}
            className='absolute flex justify-center items-center w-full h-full bg-black/30 backdrop-blur-xl'>
            
            <div className='w-[60%] min-w-[500px] h-[70%] min-h-[600px] bg-(--bg-primary) border-2 border-(--button-group-primary-bg) m-[30px] rounded-[15px]'>
                <div className='flex justify-center items-center h-20'>
                    <h1 className='text-(--text-primary) text-[26px] mb-2.5' style={{fontWeight: '800'}}>
                        Добавить файл в проект
                    </h1>
                </div>

                <form className='h-[80%] flex flex-col justify-center items-center'>
                    <div className='flex gap-3 w-[80%] justify-between mb-10'>
                        <label htmlFor='fileVersion' className='text-[18px] text-(--text-primary) pt-1.5'>Версия файла</label>
                        <input id='fileVersion' type='text' placeholder='Например:  V.0.1' value={version} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVersion(e.target.value)} required className='w-[600px] h-[45px] p-2 border border-black bg-(--button-group-primary-bg) outline-(--button-group-primary-bg) rounded-sm text-(--text-primary) placeholder:text-[black] placeholder:opacity-[0.5]'></input>
                    </div>
                    <div className='flex gap-3 w-[80%] justify-between mb-10'>
                        <label htmlFor='fileVersion' className='text-[18px] text-(--text-primary) pt-1.5'>Описание</label>
                        <textarea id='fileVersion' type='text' placeholder='Опишите внесенные в файл изменения...' value={description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} required className='w-[600px] h-[135px] h-max-[300px] p-2 border border-black bg-(--button-group-primary-bg) outline-(--button-group-primary-bg) rounded-sm text-(--text-primary) placeholder:text-[black] placeholder:opacity-[0.5]'></textarea>
                    </div>
                    <div className='flex gap-3 w-[80%] justify-between'>
                        <h3 className='text-[18px] text-(--text-primary) pt-1.5'>Файл модели:</h3>
                        <label htmlFor='fileProject' className='flex justify-center items-center cursor-pointer px-[15px] ml-[50px] w-[600px] h-[45px] bg-(--button-group-primary-bg) rounded-sm text-[18px] border text-(--text-primary) hover:border-[#d0cfcfff] hover:border-2 transition-all'>Выбрать файл модели</label>
                        <input id='fileProject' type='file' className='hidden' accept='.ifc' onChange={handleFileChange}></input>
                    </div>
                    
                </form>
            </div>

        </motion.div>
    )
}

export default AddFileToProjectForm