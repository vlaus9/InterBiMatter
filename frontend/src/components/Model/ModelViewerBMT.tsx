import { Viewer, loader, type ViewerLoadedModels, type ViewerApi, type ViewerSelection } from "bimatter-viewer-react"
import { useState, useEffect, useRef } from "react"
import { useAppSelector } from "../../app/hooks"


const ModelViewerBMT: React.FC = () => {

    const [modelsData, setModelsData] = useState<ViewerLoadedModels>()
    const [selected, setSelected] = useState<ViewerSelection>({})
    const viewerRef = useRef<ViewerApi>(null)
    const currentProject = useAppSelector((state) => state.projectSlice.project)
    if (!currentProject) return null

    useEffect(() => {
        loader.loadModel([currentProject.modelPath], { useIfcSpace: true }).then(setModelsData)
    }, [])


    if (!modelsData) return

    return (
        <>
            
            
            <div className='p-5 bg-amber-950 absolute bottom-0 flex gap-10 text-white text-2xl z-10'>  

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
                <button onClick={() => console.log(selected)}>
                    Show Selected
                </button>
                
            </div>

            <Viewer selected={selected} onSelectedChange={setSelected} ref={viewerRef} modelsData={modelsData} onReady={() => { 
                console.log('готово')
                viewerRef.current?.camera.fitCamera()}} showStats/>
            
        </>
    )

}

export default ModelViewerBMT

// import { useEffect, useRef, useState } from "react";
// import {
//     loader,
//     Viewer,
//     type ViewerApi,
//     type ViewerLoadedModels,
//     type ViewerSelection,
// } from "bimatter-viewer-react";

// function ModelViewerBMT() {
//     const viewerRef = useRef<ViewerApi>(null);
//     const [modelsData, setModelsData] = useState<ViewerLoadedModels>();
//     const [selected, setSelected] = useState<ViewerSelection>({});
//     useEffect(() => {
//         loader.loadModel(["Clinic_Architectural.ifc"]).then(setModelsData);
//     }, []);

//     if (!modelsData) return null;

//     console.log(viewerRef.current?.camera.getIntersection(true))
    
//     return (
//         <>

//             <div className='z-10 absolute bottom-0 flex gap-5 text-white text-2xl'>

//                 <button onClick={() => viewerRef.current?.camera.fitCamera()}>
//                     Fit
//                 </button>
//                 <button
//                     onClick={() => viewerRef.current?.geometryUtils.hideSelected()}
//                 >
//                     Hide selected
//                 </button>
//                 <button
//                     onClick={() =>
//                         viewerRef.current?.geometryUtils.isolateSelected()
//                     }
//                 >
//                     Isolate selected
//                 </button>
//                 <button onClick={() => viewerRef.current?.geometryUtils.showAll()}>
//                     Show all
//                 </button>
//                 <button onClick={() => console.log(selected)}>
//                     Show selected
//                 </button>

//             </div>
            

//             <Viewer
//                 ref={viewerRef}
//                 modelsData={modelsData}
//                 selected={selected}
//                 onSelectedChange={setSelected}
//             />
//         </>
//     );
// }
// export default ModelViewerBMT
