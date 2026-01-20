import { useRef } from "react"
import useThreeScene from "./useThreeScene"
import useCamera from "./useCamera"
import useAnimation from "./useAnimation"
import useModelLoader from "./useModelLoader"
import useSceneSetup from "./useSceneSetup"

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

    const isAllReady = scene && camera && renderer && controls
    useAnimation(
        isAllReady ? scene : null, 
        isAllReady ? camera : null, 
        isAllReady ? renderer : null, 
        isAllReady ? controls : null)

    const { loading, error } = useModelLoader(modelUrl, scene)
    console.log([scene, camera, renderer, controls, loading, error])

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
    