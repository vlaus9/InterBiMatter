import type { ISmartButtonData } from "../types/SmartButtonTypes"
import IconOk from '../icons/iconOk' 
import ModalWindowComponent from '../../ModalWindow/ModalWindowComponent'
import { ModalWindowData } from "../../ModalWindow/data/ModalWindowData"


export const SmartButtonData: ISmartButtonData = [
    {
    id: '1',
    name: 'Кнопка 1',
    icon: IconOk,
    iconProps: { color: '#f0f7f4ff'},
    contentType: "string",
    contentData: ModalWindowData[0],
    clickAction: ModalWindowComponent,
    },
    {
    id: '2',
    name: 'Кнопка 2',
    icon: IconOk,
    iconProps: { color: '#f0f7f4ff'},
    contentType: "string",
    contentData: ModalWindowData[1],
    clickAction: ModalWindowComponent,
    },
    {
    id: '3',
    name: 'Кнопка 3',
    icon: IconOk,
    iconProps: { color: '#f0f7f4ff'},
    contentType: "string",
    contentData: ModalWindowData[2],
    clickAction: ModalWindowComponent,
    },
    
]