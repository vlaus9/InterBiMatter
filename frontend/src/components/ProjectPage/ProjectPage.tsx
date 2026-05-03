import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { select } from 'three/src/nodes/TSL.js'


const ProjectPage: React.FC = () => {

    const dispatch = useAppDispatch()
    const selectProject = useAppSelector((state) => state.projectPage)

    console.log(selectProject)

    return (
        <div className='flex flex-col items-center w-screen h-screen bg-(--bg-primary)'>
            <div className='w-[80%] mt-[50px]'>
                <h1 className='text-[28px] text-(--text-primary)]' style={{fontWeight: '800'}}>Профиль</h1>
            </div>
            <div className='w-[80%] mt-10'>
                <span className='flex gap-5 text-[20px] text-(--text-primary)]'>
                    <h1>Пользователь:</h1>
                    <h1 style={{fontWeight: '800'}}>{selectProject.name}</h1>
                </span>
                <span className='flex gap-5 text-[20px] text-(--text-primary)]'>
                    <h1>Логин:</h1>
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
        </div>
    )
}

export default ProjectPage