import type { ReactElement } from "react"

export interface IModalWindow {
    id: string | number | null
    name: string | null
    contenType: string | null
    contentData: string 
    isOpen: boolean
}

export type ImodalWindowData = IModalWindow[]