import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { useRef } from 'react'
import { useEffect } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// interface IModelViewer {
//     modelUrl: string,
//     className?: string
// }

const ModelViewer: React.FC  = () => {
    
    const mountRef = useRef<HTMLDivElement>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const mountedRef = useRef<boolean>(false)
    const animationFrameId = useRef<number | null>(null)
    const modelRef = useRef<THREE.Object3D | null>(null)


    useEffect(() => {

    if (!mountRef.current || mountedRef.current) return
    mountedRef.current = true

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
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    rendererRef.current = renderer
    

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8)
    directionalLight.position.set(10, 10, 10)
    scene.add(directionalLight)

    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222)
    scene.add(gridHelper)

    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    mountRef.current.appendChild(renderer.domElement)

    const loader = new GLTFLoader()
    loader.load(
        'https://threejs.org/examples/models/gltf/AnisotropyBarnLamp.glb',
        (gltf) => {
            const model = gltf.scene
            modelRef.current = model
            const box = new THREE.Box3().setFromObject(model)
            const center = box.getCenter(new THREE.Vector3())
            const size = box.getSize(new THREE.Vector3())

            model.position.x = -center.x
            model.position.y = -center.y
            model.position.z = -center.z
            
            const maxDim = Math.max(size.x, size.y, size.z)
            const scale = 10 / maxDim
            model.scale.multiplyScalar(scale)

            camera.position.set(
                size.x * 1.5 * scale,
                size.y * 1.5 * scale,
                size.z * 1.5 * scale
            )
            camera.lookAt(0, 0, 0)
            controls.update()
    
            scene.add(model)
        },
        (xhr) => {
            const percent = (xhr.loaded / xhr.total) * 100
            console.log(`Загружено: ${percent.toFixed(2)}%`)
        },
        (error) => {
            console.error('Ошибка загрузки модели:', error)
            const geometry = new THREE.BoxGeometry(1, 1, 1)
            const material = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                wireframe: true
            })
            const cube = new THREE.Mesh(geometry, material)
            scene.add(cube)
        }
    )

    const animate = () => {
        animationFrameId.current = requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
    }

    animate()

    return () => {

        scene.remove(gridHelper)
        scene.remove(axesHelper)

        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current)
        }

        controls.dispose()

        if (modelRef.current && scene) {
            scene.remove(modelRef.current)
        }

        

        if (renderer) {
            renderer.dispose()
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement)
            }
        }
        mountedRef.current = false
    }
    }, [])
// modelUrl должно быть в зависимости

    //ЖЕЛАТЕЛЬНО ДОБАВИТЬ ОБРАБОТЧИК РЕЗАЙЗА ЧТОБЫ ИСКАЖЕНИЙ НЕ БЫЛО




    return (
        <div className={`absolute left-[0] right-[0] `}>
            <div
                ref={mountRef}
                className='w-[600px] h-[600px]'>
            </div>
        </div>
    )

}

export default ModelViewer