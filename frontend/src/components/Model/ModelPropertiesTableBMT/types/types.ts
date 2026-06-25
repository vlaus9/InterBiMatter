import type { BmtPropertyValue } from "bimatter-viewer-react"

// // Данные до парсинга
// export interface IElement {
//     id: number
//     guid: string
//     props: IElementProps
//     sets: IPropertySet[]
// }

// export interface IElementProps {
//     name: string
//     longName: string
//     type: string
//     typeName: string
// }

// export interface IPropertySet {
//     id: number
//     giud: string
//     name: string
//     isQuantities: boolean
//     props: IProperty[]
// }

// export interface IProperty {
//     Name: string
//     NominalValue?: number
//     AreaValue?: number
//     type?: string
// }

// Данные после парсинга
export interface IFlatElement {
    id: number | undefined
    guid: string | undefined
    name: string | undefined
    longName: string | undefined
    type: string | undefined
    typeName: string | undefined
    [key: string]: any
}