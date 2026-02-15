import { useRef } from "react"
import useThreeScene from "./viewing/useThreeScene"
import useCamera from "./viewing/useCamera"
import useAnimation from "./viewing/useAnimation"
import useModelLoader from "./viewing/useModelLoader"
import useSceneSetup from "./viewing/useSceneSetup"
import useResize from "./viewing/useResize"
import useModelLoaderIFC from "./viewing/useModelLoaderIFC"

interface IModelViewerProps {
    modelUrl: string,
    className?: string
}

const ModelViewer: React.FC<IModelViewerProps> = ({
    modelUrl,
    className = ''
}) => {

    const containerRef = useRef<HTMLDivElement>(null)

    const { scene, renderer, isReady } = useThreeScene(containerRef)
    const { camera, controls } = useCamera(containerRef, renderer, isReady)

    useSceneSetup(scene)
    useResize(containerRef, camera, renderer)

    const isAllReady = scene && camera && renderer && controls
    useAnimation(
        isAllReady ? scene : null, 
        isAllReady ? camera : null, 
        isAllReady ? renderer : null, 
        isAllReady ? controls : null)

    useModelLoaderIFC(modelUrl, scene, camera, controls)
        
        
    return (
        <div className="absolute left-[0] top-[0] w-[100vw] h-[100vh]">
            <div
            ref={containerRef}
            className='w-full h-full'
            >
                
            </div>

        </div>
    )
}

export default ModelViewer
    