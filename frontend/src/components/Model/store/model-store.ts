import * as FRAGS from "@thatopen/fragments"

class ModelStore {
    private static instance: ModelStore

    private _model: FRAGS.FragmentsModel | null = null

    static getInstance() { 
        if (!ModelStore.instance) {
            ModelStore.instance = new ModelStore()
        }

        return ModelStore.instance
    }

    setModel(model: FRAGS.FragmentsModel | null) {
        this._model = model
    }

    getModel(): FRAGS.FragmentsModel | null {
        return this._model
    }
}

export const modelStore = ModelStore.getInstance()