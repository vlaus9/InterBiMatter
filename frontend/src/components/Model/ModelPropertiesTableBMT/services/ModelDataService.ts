import { GetFlatData } from "./getFlatData"
import type { BmtModelProps, ViewerModelPropsStore } from "bimatter-viewer-react"
import type { IFlatElement } from "../types/types"

class ModelDataService {

    private _rawData: ViewerModelPropsStore = {}
    private _flatData: IFlatElement[] = []
    private _propertyKeys: string[] = []

    public onLoadDataEvent: number = 0


    load(elements: ViewerModelPropsStore): void {
        this._rawData = elements
        this._flatData = GetFlatData.parse(Object.values(elements)[0] || {})
        this._propertyKeys = GetFlatData.getKeys(this._flatData)
        this.onLoadDataEvent++
    }

    getFlatData(): IFlatElement[] {
        return this._flatData
    }

    getPropertyKeys(): string[] {
        return this._propertyKeys
    }

    getById(id: number): IFlatElement | undefined {
        return this._flatData.find(el => el.id === id)
    }

    getByName(name: string): IFlatElement[] | undefined {
        if (!name.trim()) return this._flatData

        const lowerName = name.toLowerCase()
        return this._flatData.filter(el => el.name?.toLowerCase().includes(lowerName))
    }
}


export const modelData = new ModelDataService()
