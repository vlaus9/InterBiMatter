import type { ISmartButtonData } from "../types/SmartButtonTypes"
import { ModalWindowData } from "../../ModalWindow/data/ModalWindowData"
import IconOk from '../icons/iconOk' 
import ModalWindowComponent from '../../ModalWindow/ModalWindowComponent'
import Profile from "../../Profile/Profile"
import { Navigate } from "react-router"
import type { NavigateFunction } from "react-router"
 

export const SmartButtonDataAttribut: ISmartButtonData = [
    {
    id: '1',
    name: 'Кнопка 1',
    icon: IconOk,
    iconProps: { color: '#f0f7f4ff'},
    contentType: "string",
    contentData: ModalWindowData[0],
    clickAction: ModalWindowComponent,
    side: 'left'
    },
    {
    id: '2',
    name: 'Кнопка 2',
    icon: IconOk,
    iconProps: { color: '#f0f7f4ff'},
    contentType: "string",
    contentData: ModalWindowData[1],
    clickAction: ModalWindowComponent,
    side: 'left'
    },
    {
    id: '3',
    name: 'Кнопка 3',
    icon: IconOk,
    iconProps: { color: '#f0f7f4ff'},
    contentType: "string",
    contentData: ModalWindowData[2],
    clickAction: ModalWindowComponent,
    side: 'left'
    },
    
]

export const SmartButtonDataProfile: ISmartButtonData = [
    {
        id: '4',
        name: 'Профиль',
        icon: IconOk,
        iconProps: { color: '#f0f7f4ff'},
        contentType: "string",
        clickAction: Profile,
        side: 'right',
        navigate: '/profile'
    }
]