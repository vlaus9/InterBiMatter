import { useEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

const useResize = (
    containerRef: React.RefObject<HTMLElement | null>,
    camera: THREE.PerspectiveCamera | null,
    renderer: THREE.WebGLRenderer | null
) => {

    useEffect(() => {
        if (!containerRef || !camera || !renderer) return
        const handleResize = () => {
            const width = containerRef.current!.clientWidth
            const height = containerRef.current!.clientHeight
        
            camera.aspect = width / height
            camera.updateProjectionMatrix()

            renderer.setSize(width, height)
            renderer.setPixelRatio(window.devicePixelRatio)
        }

        window.addEventListener('resize', handleResize)

        handleResize()

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [containerRef, camera, renderer])
}

export default useResize