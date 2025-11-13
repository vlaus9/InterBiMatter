import type { ISmartButtonData } from "../types/SmartButtonTypes"
import IconOk from '../icons/iconOk' 
import ModalWindow from '../../ModalWindow/ModalWindowComponent'
import { ModalWindowData } from "../../ModalWindow/data/ModalWindowData"

export const SmartButtonData: ISmartButtonData = [
    {
    id: '1',
    name: 'Кнопка 1',
    icon: IconOk,
    iconProps: { color: '#f0f7f4ff'},
    contentType: "string",
    contentData: ModalWindowData[0],
    clickAction: ModalWindow,
    },
    {
    id: '2',
    name: 'Кнопка 1',
    icon: IconOk,
    iconProps: { color: '#f0f7f4ff'},
    contentType: "string",
    contentData: ModalWindowData[0],
    clickAction: ModalWindow,
    },
    {
    id: '3',
    name: 'Кнопка 1',
    icon: IconOk,
    iconProps: { color: '#f0f7f4ff'},
    contentType: "string",
    contentData: ModalWindowData[0],
    clickAction: ModalWindow,
    },
    
]