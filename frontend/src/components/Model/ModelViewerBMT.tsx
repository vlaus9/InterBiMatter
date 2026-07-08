import { Viewer, loader, type ViewerLoadedModels, type ViewerApi, type ViewerSelection } from "bimatter-viewer-react"
import { useState, useEffect, useRef } from "react"
import { useAppSelector } from "../../app/hooks"
import { GetFlatData } from "./ModelPropertiesTableBMT/services/getFlatData"
import { modelData } from "./ModelPropertiesTableBMT/services/ModelDataService"


const ModelViewerBMT: React.FC = () => {

    const [modelsData, setModelsData] = useState<ViewerLoadedModels>({})
    const [selected, setSelected] = useState<ViewerSelection>({})
    const viewerRef = useRef<ViewerApi>(null)
    const currentProject = useAppSelector((state) => state.projectSlice.project)
    if (!currentProject) return null

    const loadInitialModel = (viewer: ViewerApi) => {
        void viewer.models.loadModels([currentProject.modelPath], { clearViewer: true, onModelsDataChange: (data) => {
            setTimeout(() => {
                if (data) {
                    setModelsData(data)
                }
            }, 0) 
        }
    })}

    useEffect(() => {
        const data = viewerRef.current?.properties.getModelProps()
        if (data) {
            modelData.load(data)
        }
        const flatData = modelData.getFlatData()
    }, [modelsData])

    return (
        <>
            
            
            <div className='p-5 absolute bottom-0 flex gap-10 text-white text-2xl z-10'>  

                <button onClick={() => viewerRef.current?.camera.fitCamera()}>
                    Camera Fit
                </button>
                <button onClick={() => viewerRef.current?.geometryUtils.hideSelected()}>
                    Hide Selected
                </button>
                <button onClick={() => viewerRef.current?.geometryUtils.isolateSelected()}>
                    Isolate Selected
                </button>
                <button onClick={() => viewerRef.current?.geometryUtils.showAll()}>
                    Show All
                </button>
                <button onClick={() => console.log(selected[0][0])}>
                    Show Selected
                </button>
                
            </div>

            <Viewer selected={selected} materialMode='performance' performanceMode onSelectedChange={setSelected} ref={viewerRef} modelsData={modelsData} onReady={loadInitialModel}/>
                

        
        </>
    )

}

export default ModelViewerBMT




    