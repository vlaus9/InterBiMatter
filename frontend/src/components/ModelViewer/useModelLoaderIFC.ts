import { useEffect, useState } from "react"
import * as THREE from "three"
import * as OBC from "@thatopen/components"


const useModelLoaderIFC = (
    modelURL: string,
    scene: THREE.Scene | null
) => {


    const [model, setModel] = useState<THREE.Group | null>(null)
    const [components, setComponents] = useState<OBC.Components | null>(null)
    const [loaderReady, setLoaderReady] = useState<boolean>(false)
    const [world, setWorld] = useState<OBC.World | null>(null)

    useEffect(() => {
        
        const initComponents = async () => {

            try{
            
            const coreComponents = new OBC.Components()
            coreComponents.init()
            const worlds = coreComponents.get(OBC.Worlds)
            
            const world = worlds.create<
            OBC.SimpleScene,
            OBC.SimpleCamera,
            OBC.SimpleRenderer>()

            world.scene = new OBC.SimpleScene(coreComponents)
            world.scene.setup()
            world.scene.three.background = new THREE.Color(0xf0f0f0)

            const container = document.createElement("div")
            container.style.width = '1px'
            container.style.height = '1px'
            container.style.position = 'absolute'
            container.style.overflow = 'hidden'
            document.body.appendChild(container)

            world.renderer = new OBC.SimpleRenderer(coreComponents, container)

            world.camera = new OBC.SimpleCamera(coreComponents)
            world.camera.controls.setLookAt(10, 10, 10, 0, 0, 0)

            

            const ifcLoader = coreComponents.get(OBC.IfcLoader)

            await ifcLoader.setup({
                wasm: {
                path: "https://unpkg.com/web-ifc@0.0.53/",
                absolute: true
            },
                webIfc: {
                    COORDINATE_TO_ORIGIN: true
                }
            })

            setWorld(world)
            setComponents(coreComponents)
            setLoaderReady(true)
            console.log('Компоненты инициализированы')
            } catch (error: any) {
                console.error('Ошибочка в инициализации вышла', error.message)
            }
            
        }

        initComponents()

        return () => {
            if (components) {
                components.dispose()
            }
        }

    }, [])

    useEffect(() => {
        const loadModel = async () => {
            if (!loaderReady || !components || !scene || !modelURL) return

        try {
            
            const ifcLoader = components.get(OBC.IfcLoader)
            const fragment = components.get(OBC.FragmentsManager)
            const handleFragmentLoaded = (group: any) => {
                if (!group.isObject3D) return
                
                scene.add(group)
                setModel(group)
                const box = new THREE.Box3().setFromObject(group); 
                const size = box.getSize(new THREE.Vector3()); 
                const maxDim = Math.max(size.x, size.y, size.z); 
                const scale = 10 / maxDim;
                group.scale.multiplyScalar(scale)
                box.setFromObject(group)
                const center = box.getCenter(new THREE.Vector3()); // Центр модели
                group.position.sub(center)
                console.log('Модель загружена')
                
            }
            fragment.onFragmentsLoaded.add(handleFragmentLoaded)

            const response = await fetch(modelURL)
            const data = await response.arrayBuffer()
            const buffer = new Uint8Array(data)

            await ifcLoader.load(buffer, true, 'model')
          
            return () => {
                fragment.onFragmentsLoaded.remove(handleFragmentLoaded)
                if (model) scene?.remove(model)
            }
            
            }
            catch (error: any) {
                console.log('Ошибка загрузки модели', error.message)
            }
        }
        loadModel()
    }, [modelURL, scene, loaderReady])

}

export default useModelLoaderIFC