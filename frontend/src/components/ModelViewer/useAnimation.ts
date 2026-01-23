import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

const useAnimation = (
    scene: THREE.Scene | null,
    camera: THREE.PerspectiveCamera | null,
    renderer: THREE.WebGLRenderer | null,
    controls: OrbitControls | null
) => {
    
    const animationRef = useRef<number | null>(null)

    useEffect(() => {

        if (!scene || !camera || !renderer || !controls) return

        const animate = () => {
            animationRef.current = requestAnimationFrame(animate)

            controls.update()

            renderer.render(scene, camera)
        }

        animate()

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [scene, camera, renderer, controls])
}

export default useAnimation