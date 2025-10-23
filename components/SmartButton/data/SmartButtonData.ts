import type { ISmartButtonData } from "../types/SmartButtonTypes"
import IconOk from '../icons/iconOk' 
import ModalWindow from '../../ModalWindow/ModalWindow'

export const SmartButtonData: ISmartButtonData = [
    {
    id: '1',
    name: 'Кнопка 1',
    icon: IconOk,
    iconProps: { color: '#f0f7f4ff'},
    contentType: "string",
    contentData: 'u',
    clickAction: ModalWindow,
    },
]