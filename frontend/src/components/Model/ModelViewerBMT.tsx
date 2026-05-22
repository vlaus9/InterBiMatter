import { Viewer, loader, type ViewerLoadedModels, type ViewerApi, type ViewerSelection } from "bimatter-viewer-react"
import { useState, useEffect, useRef } from "react"
import { useAppSelector } from "../../app/hooks"


const ModelViewerBMT: React.FC = () => {

    const [viewerApi, setViewerApi] = useState<ViewerApi>()
    const [modelsData, setModelsData] = useState<ViewerLoadedModels>()
    const [selected, setSelected] = useState<ViewerSelection>({})
    const viewerRef = useRef<ViewerApi>(null)
    const currentProject = useAppSelector((state) => state.projectSlice.project)
    if (!currentProject) return null

    useEffect(() => {
        loader.loadModel([currentProject.modelPath], { useIfcSpace: true }).then(setModelsData)

    }, [])

    useEffect(() => {
        const handleClick = () => {
            const intersection = viewerRef.current?.camera.getIntersection()
            

            if (intersection) {
                viewerRef.current?.geometryUtils.isolateByIds([intersection[0].object.id])
            }
        }

        window.addEventListener('click', handleClick)

        return () => {
            window.removeEventListener('click', handleClick)
        }
    }, [])

    window.addEventListener('click', () => {
        
        console.log(viewerRef.current?.camera.getIntersection(true))
    }
    )

    if (!modelsData) return

    // if (selected) console.log(viewerRef.current?.camera.getIntersection(true))
    return (
        <>
            <Viewer selected={selected} onSelectedChange={setSelected} ref={viewerRef} modelsData={modelsData} showStats/>

            <button className=' absolute bottom-0 text-white text-2xl' onClick={() => viewerRef.current?.camera.fitCamera()}>
                Fit
            </button>
            <button className=' absolute bottom-0 text-white text-2xl' onClick={() => console.log(selected)}>
                ПАКАЖИ
            </button>
        </>
    )

}

export default ModelViewerBMT