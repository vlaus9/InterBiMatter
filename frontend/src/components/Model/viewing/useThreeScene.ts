import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

const useThreeScene = (containerRef: React.RefObject<HTMLElement | null>) => {

    const sceneRef = useRef<THREE.Scene | null>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const [isReady, setIsReady] = useState<boolean>(false)

    useEffect(() => {

        if (!containerRef.current) return
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x1a1a1a)
        sceneRef.current = scene
        
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        rendererRef.current = renderer

        containerRef.current.appendChild(renderer.domElement)

        setIsReady(true)

        return () => {
            
            setIsReady(false)

            renderer.dispose()

            if (containerRef.current?.contains(renderer.domElement)) {
                containerRef.current.removeChild(renderer.domElement)
            }
    
        }
    }, [])

    return { scene: sceneRef.current, renderer: rendererRef.current, isReady }
}

export default useThreeScene