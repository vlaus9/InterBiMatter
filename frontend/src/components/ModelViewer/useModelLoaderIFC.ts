import { useEffect, useState } from "react"
import * as THREE from "three"
import * as OBC from "@thatopen/components"
import * as FRAG from "@thatopen/fragments"
import type { OrbitControls } from "three/examples/jsm/Addons.js"


const useModelLoaderIFC = (
    modelURL: string,
    scene: THREE.Scene | null,
    camera: THREE.Camera | null,
    controls: OrbitControls | null
) => {


    const [ready, setReady] = useState<boolean>(false)
    const [worker, setWorker] = useState<string>('')
    const [fragmentsBytes, setFragmentsBytes] = useState<Uint8Array<ArrayBufferLike> | null>(null)


    const ifcImporter = new FRAG.IfcImporter()
    ifcImporter.wasm = { absolute: true, path: "https://unpkg.com/web-ifc@0.0.75/"}
    

    useEffect(() => {

        if (modelURL) {

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

        const getWorkerUrl = async () => {
            
        try {

            const githubUrl = "https://thatopen.github.io/engine_fragment/resources/worker.mjs"
            const fetchedUrl = await fetch(githubUrl)
            const workerBlob = await fetchedUrl.blob()
            const workerFile = new File([workerBlob], "worker.mjs", {
                type: "text/javascript"})
            const workerUrl = URL.createObjectURL(workerFile)
            setWorker(workerUrl)

            return 
        } catch (error: any) {
            console.log("Ошибка настройки ядра фрагментов:", error.message)
        }
        }
        
        getWorkerUrl()

        }
            
    }, [modelURL, scene, camera, controls])


    useEffect (() => {
       
    const loadModel = async () => {

            try {
                if (!fragmentsBytes || !ready || !worker) return
                const fragmentsModel = new FRAG.FragmentsModels(worker)
                const model = await fragmentsModel.load(fragmentsBytes, { modelId: "model"})
                
                if (camera) {
                    model.object.add(camera)
                }
                scene?.add(model.object)
                
                await fragmentsModel.update(true)
                
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
            } catch (error: any) {
                console.log("Ошибка загрузки модели:", error.message)
            }
        }

            loadModel()


}, [ready])

}


export default useModelLoaderIFC