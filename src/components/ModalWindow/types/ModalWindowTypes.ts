export interface IModalWindow {
    id: string | number | null
    name: string | null
    contenType: string | null
    contentData: string | null
    isOpen: boolean
}

export type ImodalWindowData = IModalWindow[]