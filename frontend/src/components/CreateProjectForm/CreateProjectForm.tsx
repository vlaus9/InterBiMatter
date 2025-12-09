import { useState } from "react"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import axios from "axios"
import { createProject, cleanError } from "./slices/projectSlice"

const CreateProjectForm: React.FC = () => {
    
    const [nameProject, setNamePRoject] = useState<string>('')
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
        <div className='absolute w-full h-full bg-[blue]'>

        </div>
    )
} 


export default CreateProjectForm