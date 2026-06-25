import type { any } from "three/src/nodes/TSL.js"
import { type IElement, type IFlatElement } from "../types/types"
import type { BmtModelProps, BmtElementProps, BmtPropertySet, BmtPropertyRecord } from "bimatter-viewer-react"

export class GetFlatData {

    //Парсим все данные элементов модели в плоские
    static parse(elements: BmtModelProps): IFlatElement[] {
        return Object.values(elements).map(element => this.flatten(element))
    }

    static flatten(element: BmtElementProps): IFlatElement {

        const flat: IFlatElement = {
            id: element.id,
            guid: element.guid,
            name: element.props?.name as string,
            longName: element.props?.longName as string,
            type: element.props?.type as string,
            typeName: element.props?.typeName as string,
        }

        element.sets?.forEach((set: BmtPropertySet) => {
            if (set && set.props && Array.isArray(set.props)) {

                (set.props as BmtPropertyRecord[]).forEach((prop) => {
                    const key = `${set.name}_${prop.Name}`
    
                    if (prop.type === "IfcQuantityArea") {
                        flat[key] = prop.AreaValue
                    } else {
                        flat[key] = prop.NominalValue
                    }
                })

            }
        })

        return flat
    }

    //Возвращаем ключи
    static getKeys(flatElements: IFlatElement[]): string[] {
        const keysSet = new Set<string>()

        flatElements.forEach(element => {
            Object.keys(element).forEach(key => keysSet.add(key))
        })

        return Array.from(keysSet).sort()
    }
}