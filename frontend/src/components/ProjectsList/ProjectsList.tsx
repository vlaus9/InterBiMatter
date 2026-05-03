import { useEffect } from "react"
import { getProjectsAll } from "./slice/ProjectsListSlice"
import { openProject } from "../CreateProjectForm/slices/projectSlice"
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { useNavigate } from "react-router"
import { selectProject } from "../ProjectPage/slice/ProjectPageSlice"

const ProjectsList: React.FC = () => {

    const user = useAppSelector((state) => state.authSlice.user?.name)
    const projectList = useAppSelector((state) => state.projectList)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const openProjectPage = (id: string) => {
        dispatch(selectProject(projectList.projects?.find(project => project._id === id)))
        navigate('/projectPage')
    }

    // это перенести чуть глубже
    // const openProjectClick = (id: string) => {
    //     dispatch(openProject(id))
    //     navigate('/Project')
    // }

    if (user) {
        useEffect(() => {
            dispatch(getProjectsAll(user))
        },[])
    }

if (projectList && projectList.projects) {

    return (
        <>

        <div className='w-full grid grid-cols-5 text-center divide-x-2 divide-solid border border-(--button-group-primary-bg) border-b-[black] border-b-[2px] rounded-t-[10px] mb-[2px]' >
                    <h3 style={{fontWeight: 700}} className=''>Название</h3>
                    <h3 style={{fontWeight: 700}} className=''>Автор</h3>
                    <h3 style={{fontWeight: 700}} className=''>Версия</h3>
                    <h3 style={{fontWeight: 700}} className=' col-span-2'>Имя файла</h3>
                </div>

        {
            projectList.projects.map((project) => {
                return (
                <div onClick={() => openProjectPage(project._id!)} key={project.id} className='w-full grid grid-cols-5 text-center divide-x-2 divide-solid cursor-pointer border border-(--button-group-primary-bg) rounded-[10px] hover:border-[var(--bg-secondary)] mb-[5px]'>
                    <h3 className=''>{`${project.name}`}</h3>
                    <h3 className=''>{`${project.autor}`}</h3>
                    {/* Должна быть активная версия файла */}
                    <h3 className=''>{`${project.versions[0].name}`}</h3>
                    <h3 className=' col-span-2'>{`${project.modelPath.split('/').pop()}`}</h3>
                </div>
                )
            })
        }
            
        </>
    )

}





    
}

export default ProjectsList
