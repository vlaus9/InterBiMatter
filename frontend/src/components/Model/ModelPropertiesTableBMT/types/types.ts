import type { BmtPropertyValue } from "bimatter-viewer-react"

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

export interface VirtualTableProps {
    columns: string[];
    data: IFlatElement[];
    rowHeight?: number;
    overscan?: number;
    containerHeight?: number;
    defaultColumnWidth?: number;
}

export interface ISelectPropertiesComponentProps {
    allColumns: string[],
    initialSelectColumns: string[]
}