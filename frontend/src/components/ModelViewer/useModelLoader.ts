import { useEffect, useState } from "react"
import * as THREE from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"


const useModelLoader = (
    modelUrl: string,
    scene: THREE.Scene | null
) => {

    const [model, setModel] = useState<THREE.Group | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        
        if (!modelUrl || !scene) return
        
        
        setLoading(true)
        setError(null)

        const loader = new GLTFLoader()
        loader.load(
            modelUrl,
            (gltf) => {
                const model = gltf.scene
                
                const box = new THREE.Box3().setFromObject(model)
                const center = box.getCenter(new THREE.Vector3())
                const size = box.getSize(new THREE.Vector3())
                
                // model.position.x = -center.x
                model.position.y = -box.min.y
                // model.position.z = -center.z
                
                const maxDim = Math.max(size.x, size.y, size.z)
                const scale = 10 / maxDim
                model.scale.multiplyScalar(scale)
                model.position.multiplyScalar(scale)

                scene.add(model)
                setModel(model)
                setLoading(false)

                console.log('Загружено')
            },
            (xhr) => {
                const percent = (xhr.loaded / xhr.total) * 100
                console.log(`Загружено: ${percent.toFixed(2)}%`)
            },
            (error) => {
                console.log('Ошибка загрузки:', error)
                setError('Не удалось загрузить модель')
                setLoading(false)
            }
        )
    }, [modelUrl, scene])
    

    return { model, loading, error}
}

export default useModelLoader