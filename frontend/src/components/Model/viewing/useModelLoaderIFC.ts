import { useEffect, useState } from "react"
import * as THREE from "three"
import * as FRAGS from "@thatopen/fragments"
import type { OrbitControls } from "three/examples/jsm/Addons.js"
import { editor } from "../editing/usePropertiesEditor"



const useModelLoaderIFC = (
    modelURL: string,
    scene: THREE.Scene | null,
    camera: THREE.PerspectiveCamera | null,
    controls: OrbitControls | null
) => {

    const [ready, setReady] = useState<boolean>(false)
    const [worker, setWorker] = useState<string>('')
    const [fragmentsBytes, setFragmentsBytes] = useState<Uint8Array<ArrayBufferLike> | null>(null)
    const [box, setBox] = useState<THREE.Box3 | null>(null)
    const [updateModel, setUpdateModel] = useState<boolean>(false)
    

    const ifcImporter = new FRAGS.IfcImporter()
    ifcImporter.wasm = { absolute: true, path: "https://unpkg.com/web-ifc@0.0.75/"}
    

    useEffect(() => {

        if (modelURL) {
            //Конвертируем во фрагменты
            const convertIFC = async () => {

            try {

                const url = modelURL
                const ifcFile = await fetch(url)
                const ifcBuffer = await ifcFile.arrayBuffer()
                const ifcBytes = new Uint8Array(ifcBuffer)
                let fragBytesTemp

                    fragBytesTemp = await ifcImporter.process({
                    bytes: ifcBytes,
                    progressCallback: (progress, data) => { 
                        // console.log(progress, data)
                        if (progress === 1) {
                            setReady(true)
                        }
                    }
                })

                setFragmentsBytes(fragBytesTemp)
                
                

            } catch (error: any) {
                console.log("Ошибка конвертации IFC:", error.mesasge)
            }
        }

        convertIFC()

        //Получаем воркер
        const getWorkerUrl = async () => {
            
        try {

            const githubUrl = "https://thatopen.github.io/engine_fragment/resources/worker.mjs"
            const fetchedUrl = await fetch(githubUrl)
            const workerBlob = await fetchedUrl.blob()
            const workerFile = new File([workerBlob], "worker.mjs", {
                type: "text/javascript"})
            const workerUrl = URL.createObjectURL(workerFile)
            setWorker(workerUrl)
            editor.setWorker(workerUrl)

            return 
        } catch (error: any) {
            console.log("Ошибка настройки ядра фрагментов:", error.message)
        }
        }
        
        getWorkerUrl()

        }
            
    }, [modelURL, scene, camera, controls])



    useEffect (() => {
       
    //Грузим модель
    const loadModel = async () => {

            try {
                if (!fragmentsBytes || !ready || !worker) return

                const fragmentsModel = new FRAGS.FragmentsModels(worker)

                const model = await fragmentsModel.load(fragmentsBytes, { modelId: "model"})
                

                //отслеживаем меши (костыль)
                const waitForMeshes = async (model: FRAGS.FragmentsModel) => {
                    
                    setTimeout(() => {
                        return new Promise((resolve, reject) => {
                            //таймер времени
                            const startTime = Date.now()
                            
                            //Чекаем есть ли меши (не должно быть инфинити), 
                            // если еще инфинити значит пробуем еще раз через 
                            // секунду и одновременно проверяем что попыток 
                            // не более чем на 20 секунд (больше уже точно ошибка где то)
                            const check = () => {
                                const box = new THREE.Box3().setFromObject(model.object)
                                if (box.min.x !== Infinity) {
    
                                    //не нужно
                                    resolve(box)
                                    //отправляем в состояние
                                    setBox(box)
                                    console.log(box)
                                    //настраиваем модель и камеру
                                    setupModelAndCamera(box, model)
                                    setUpdateModel(true)
                                } else if (Date.now() - startTime > 20000) {
                                    reject(new Error('Слишком долго ждем меши, скорее всего с ними проблема'))
                                }  else {
                                    setTimeout(check, 1000)
                                }
                            }
                            check()
                        })

                    }, 500)
                }

                //Центрируем и ориентируем все правильно

                // //границы модели
                await waitForMeshes(model)


                const setupModelAndCamera = (box: THREE.Box3, model: FRAGS.FragmentsModel) => {

                    // const size = box.getSize(new THREE.Vector3())
                    // console.log(size)

                    // const center = box.getCenter(new THREE.Vector3())
                    // console.log(center)

                    // const maxSize = Math.max(size.x, size.y, size.z)
                    // const targetSize = 15
                    // const scale = targetSize / maxSize
                    // console.log(scale)

                    // model.object.scale.set(scale, scale, scale)
                    // model.object.updateMatrixWorld(true)
                    editor.setModel(model)

                    if (camera) {
                        model.useCamera(camera)
    
                        const newSphere = box.getBoundingSphere(new THREE.Sphere())
                        const radius = newSphere.radius
                        console.log(radius)
                    
                        camera.position.set(radius / 5, radius / 5, radius / 5)
                        camera.lookAt(0, 0, 0)
                    }

                    if (model && scene) {
                        scene.add(model.object)
                    }
                
                controls?.addEventListener("change", () => {
                fragmentsModel.update()
                })

                fragmentsModel.models.materials.list.onItemSet.add(({ value: material }) => {
                    if (!("isLodMaterial" in material && material.isLodMaterial)) {
                        material.polygonOffset = true
                        material.polygonOffsetUnits = 1
                        material.polygonOffsetFactor = Math.random()            
                    }
                })
        }
            
                
                    await fragmentsModel.update(true)
                    
               
                
                
            } catch (error: any) {
                console.log("Ошибка загрузки модели:", error.message)
            }
        }

            loadModel()

            
        }, [ready])
        
}


export default useModelLoaderIFC





 // if (box){
                //     const size = box.getSize(new THREE.Vector3())
                    
                //     const center = box.getCenter(new THREE.Vector3())
                //     console.log(center)
    
                //     //Масштабируем
                //     const maxSize = Math.max(size.x, size.y, size.z)
                //     const targetSize = 10
                //     const scale = targetSize / maxSize
    
                //     model.object.scale.set(scale, scale, scale)
    
                //     //Центрируем
                //     model.object.position.copy(center.clone().multiplyScalar(-scale))

                //     console.log(box)
                    
                //     if (camera) {
                //         model.useCamera(camera)
    
                //         //Ставим камеру правильно
                //         const newSphere = box.getBoundingSphere(new THREE.Sphere())
                //         const radius = newSphere.radius
                //         console.log(radius)
                //         camera.position.set(
                //             radius * 10,
                //             radius * 20,
                //             radius * 10
                //         )
                //         camera.lookAt(0, 0, 0)
                //     }
                // }
