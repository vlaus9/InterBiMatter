import type { IModalWindowProps } from '../../ModalWindow/ModalWindowComponent.tsx'
import type { IModalWindow } from '../../ModalWindow/types/ModalWindowTypes.ts'


//Интерфейс кнопки "для всего"
export interface ISmartButton {
    id: string
    name: string
    icon: React.ComponentType<IIconSmartButton>
    iconProps?: IIconSmartButton
    contentType: string
    contentData?: IModalWindow
    clickAction?: React.ComponentType<IModalWindowProps>
    side: string,
    navigate?: string
}

//Тип для массива кнопок
export type ISmartButtonData = ISmartButton[]

//интерфейс иконки кнопки
export interface IIconSmartButton {
    size?: number
    color?: string
    className?: string
}
