import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useRef } from 'react'
import { useEffect } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface IModelViewer {
    modelUrl: string,
    className?: string
}

export const ModelViewer: React.FC <IModelViewer> = ({ modelUrl }) => {
    
    const mountRef = useRef<HTMLDivElement>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)


    useEffect(() => {

    if (!mountRef.current) return

    const width = mountRef.current.clientWidth
    const height = mountRef.current.clientHeight
    
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        0.1,
        1000
    )
    camera.position.set(5, 5, 5)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    rendererRef.current = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    })







    return ()

}