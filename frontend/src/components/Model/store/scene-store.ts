import * as THREE from 'three'

class SceneStore {
    private static instance: SceneStore

    private _scene: THREE.Scene | null = null

    static getInstance(){
        if (!SceneStore.instance) {
            SceneStore.instance = new SceneStore()
        }
        return SceneStore.instance
    }

    setScene(scene: THREE.Scene) {
        this._scene = scene
    }

    getScene() {
        return this._scene
    }
}

export const sceneStore = SceneStore.getInstance()