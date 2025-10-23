export interface IModalWindow {
    id: string | number
    name: string
    contenType: string
    contentData: string
    isOpen: boolean
}

export type ImodalWindowData = IModalWindow[]