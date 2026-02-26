import * as THREE from 'three'

class CameraStore {
    private static instance: CameraStore
    
    private _camera: THREE.PerspectiveCamera | null = null

    static getInstance() {
        if (!CameraStore.instance) {
            CameraStore.instance = new CameraStore()
        }
        return CameraStore.instance
    }

    setCamera(camera: THREE.PerspectiveCamera) {
        this._camera = camera
    }

    getCamera() {
        return this._camera
    }
}

export const cameraStore = CameraStore.getInstance()