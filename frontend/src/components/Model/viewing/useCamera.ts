import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

const useCamera = ( 
    containerRef: React.RefObject<HTMLElement | null>,
    renderer: THREE.WebGLRenderer | null,
    isRendererReady: boolean
) => {
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const controlsRef = useRef<OrbitControls | null>(null)

    useEffect(() => {
        if (!containerRef.current || !renderer || !isRendererReady) return
        
        const width = containerRef.current.clientWidth
        const height = containerRef.current.clientHeight
        
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        )
        camera.position.set(5, 5, 5)
        cameraRef.current = camera

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controlsRef.current = controls
        
        return () => {
            controls.dispose()
        }
    }, [renderer, isRendererReady])
    
    return {
        camera: cameraRef.current,
        controls: controlsRef.current
    }
}

export default useCamera