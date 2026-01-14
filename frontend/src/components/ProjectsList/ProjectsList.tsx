import { useEffect } from "react";
import { getProjectsAll } from "./slice/ProjectsListSlice";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

const ProjectsList: React.FC = () => {

    const user = useAppSelector((state) => state.authSlice.user?.name)
    const projectList = useAppSelector((state) => state.projectList)
    const dispatch = useAppDispatch()

    if (user) {
        useEffect(() => {
            dispatch(getProjectsAll(user))
        },[])
    }


if (projectList && projectList.projects) {

    return (
        <>

        <div className='w-full grid grid-cols-5 text-center divide-x-2 divide-solid border border-[var(--button-group-primary-bg)] border-b-[black] border-b-[2px] rounded-t-[10px] mb-[2px]' >
                    <h3 style={{fontWeight: 700}} className=''>Название</h3>
                    <h3 style={{fontWeight: 700}} className=''>Автор</h3>
                    <h3 style={{fontWeight: 700}} className=' col-span-3'>Имя файла</h3>
                </div>

        {
            projectList.projects.map((project) => {
                return (
                <div key={project.id} className='w-full grid grid-cols-5 text-center divide-x-2 divide-solid cursor-pointer border border-[var(--button-group-primary-bg)] rounded-[10px] hover:border-[var(--bg-secondary)] mb-[5px]'>
                    <h3 className=''>{`${project.name}`}</h3>
                    <h3 className=''>{`${project.autor}`}</h3>
                    <h3 className=' col-span-3'>{`${project.modelPath}`}</h3>
                </div>
                )
            })
        }
            
        </>
    )

}





    
}

export default ProjectsList

// В СЛАЙС ЗАНОСИТ ЭТИ ПРОЕКТЫ, ОСТАЛОСЬ ПОНЯТЬ КАК ИХ ОТТУДА ДОСТАТЬ И ПОКАЗАТЬ ТАБЛИЧКОЙ