import { useEffect, useState } from "react"
import * as THREE from "three"
import { IFCLoader } from "web-ifc-three"
import { IfcAPI } from "web-ifc"
import type { IfcModel } from "web-ifc-three/IFC/BaseDefinitions"

// const IFC_TYPES = {
//   WALL: 100000005, // Стены
//   WALL_STANDARD: 100000006, // Стандартные стены
//   DOOR: 100000013, // Двери
//   WINDOW: 100000014, // Окна
//   SLAB: 100000008, // Перекрытия
//   COLUMN: 100000009, // Колонны
//   BEAM: 100000010, // Балки
//   ROOF: 100000017, // Крыши
//   STAIR: 100000025, // Лестницы
//   FURNITURE: 100000026, // Мебель
//   FLOW_SEGMENT: 100000031, // Трубы и воздуховоды
//   SPACE: 100000043 // Помещения
// } as const

interface IUseIFCLoaderOptions {
  autoCenter?: boolean // Автоматически центрировать модель
  autoScale?: boolean // Автоматически масштабировать модель
  targetScale?: number // Целевой масштаб (если autoScale = true)
  coordinateToOrigin?: boolean // Переместить модель в начало координат
  loadProperties?: boolean // Загружать свойства элементов сразу
  wasmPath?: string // Путь к WASM файлам (по умолчанию из CDN)
}

interface IFCModel extends THREE.Group {
    modelID?: number
}

const useModelLoaderIFC = (
    modelURL: string,
    scene: THREE.Scene | null,
    options: IUseIFCLoaderOptions = {}
) => {

    const {
        autoCenter = true,
        autoScale = true,
        targetScale = 10,
        coordinateToOrigin = true,
        loadProperties = true,
        wasmPath = "https://unpkg.com/web-ifc@0.0.44/"
    } = options

    const [model, setModel] = useState<IFCModel | null>(null)
    const [ifcLoader, setIfcLoader] = useState<IFCLoader | null>(null)
    const [loaderReady, setLoaderReady] = useState<boolean>(false)

    useEffect(() => {

        const initIFCLoader = async () => {
            try {
                const loader = new IFCLoader()

                setIfcLoader(loader)

                loader.ifcManager.setWasmPath("/wasm/")
                loader.ifcManager.applyWebIfcConfig({
                    COORDINATE_TO_ORIGIN: coordinateToOrigin,
                    USE_FAST_BOOLS: true,
                    CIRCLE_SEGMENTS_LOW: 12,
                    MEMORY_LIMIT: 2147483648
                })
                await new Promise(resolve => setTimeout(resolve, 500))
                setLoaderReady(true)
            } catch (error: any) {
                console.log("Ошибка инициализации IFC модели ")
            }
        }

        initIFCLoader()

    }, [])

    useEffect(() => {

        if(!loaderReady) return

        const loader = async () => {
            try {

                if (!ifcLoader) {
                    throw new Error('IFCLoader не инициализирован')
                }
                console.log([modelURL, ifcLoader])
                
                // const responce = await fetch(modelURL)
                // const arrayBuffer = await responce.arrayBuffer()
                // const loadedModel = await ifcLoader.parse(arrayBuffer)

                const model = await ifcLoader.loadAsync(
                    modelURL,
                ) as IFCModel

                if (!model) {
                    throw new Error('loadedModel отсутствует')
                }

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


                const modelID = model.modelID
                console.log(modelID)
                scene?.add(model)
            } catch (error: any) {
                console.log(`Ошибка загрузки модели: ${error.message}`)
            }
        }

    loader()
    }, [modelURL, scene])

    return 
}

export default useModelLoaderIFC