import { useEffect } from "react"
import * as THREE from 'three'

const useSceneSetup = (
    scene: THREE.Scene | null
) => {

    useEffect(() => {
        if (!scene) return

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.position.set(10, 10, 10)
        scene.add(directionalLight)

        const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222)
        scene.add(gridHelper)

        const axesHelper = new THREE.AxesHelper(5)
        scene.add(axesHelper)
    }, [scene])
}

export default useSceneSetup