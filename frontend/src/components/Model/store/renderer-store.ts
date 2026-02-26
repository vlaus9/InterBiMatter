import * as THREE from 'three'

class RendererStore {
    private static instance: RendererStore

    private _renderer: THREE.WebGLRenderer | null = null

    static getInstance() {
        if (!RendererStore.instance) {
            RendererStore.instance = new RendererStore()
        }
        return RendererStore.instance
    }

    setRenderer(renderer: THREE.WebGLRenderer) {
        this._renderer = renderer
    }

    getRenderer() {
        return this._renderer
    }
}

export const rendererStore = RendererStore.getInstance()