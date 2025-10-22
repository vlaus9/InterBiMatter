
interface contentData {
    name: string
}

//Интерфейс кнопки "для всего"
export interface ISmartButton {
    id: string
    name: string
    icon: React.ComponentType<IIconSmartButton>
    iconProps?: IIconSmartButton
    contentType: string
    contentData: string | contentData
}

//Тип для массива кнопок
export type ISmartButtonData = ISmartButton[]

//интерфейс иконки кнопки
export interface IIconSmartButton {
    size?: number
    color?: string
    className?: string
}
