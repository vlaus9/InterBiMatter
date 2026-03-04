import * as FRAGS from "@thatopen/fragments"

type ModelChangeListener = (model: FRAGS.FragmentsModel | null) => void

class ModelStore {
    private static instance: ModelStore

    private _model: FRAGS.FragmentsModel | null = null

    private listener: ModelChangeListener[] = []

    static getInstance() { 
        if (!ModelStore.instance) {
            ModelStore.instance = new ModelStore()
        }

        return ModelStore.instance
    }

    setModel(model: FRAGS.FragmentsModel | null) {
        this._model = model
        this.listener.forEach(listener => listener(model))
    }

    getModel(): FRAGS.FragmentsModel | null {
        return this._model
    }

    subscribe(listener: ModelChangeListener) {
        this.listener.push(listener)

        return () => {
            this.listener = this.listener.filter(li => li !== listener)
        }
    }
}

export const modelStore = ModelStore.getInstance()