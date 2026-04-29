import { editor } from "../editing/usePropertiesEditor"
import { useState, useEffect, useRef} from "react"
import * as FRAGS from "@thatopen/fragments"
import './style/infoUIStyles.css'

const InfoCurrentElement: React.FC = () => {
    
    
    const infoWindowRef = useRef<HTMLDivElement | null>(null)
    const [showInfoWindow, setShowInfoWindow] = useState<boolean>(false)
    const [selectedElementInfo, setSelectedElementInfo] = useState<FRAGS.ItemData | null>(null)

    useEffect(() => {

        editor.informationSelectedItem = (data) => {
                setSelectedElementInfo(data)
                setShowInfoWindow(true)
        }

        editor.closeInformationSelectedItem = () => {
            if (infoWindowRef.current) {
                infoWindowRef.current.classList.replace('info-current-element-opening', 'info-current-element-closing')
            }
            setTimeout(() => {
                setSelectedElementInfo(null)
                setShowInfoWindow(false)    
            }, 90)
        }

        return () => {
            editor.informationSelectedItem = null
            editor.closeInformationSelectedItem = null
        }

    }, [])

    if (!showInfoWindow) {
        return
    } else {
        return (
            <>
                <div className='info-current-element-opening absolute py-[15px] px-5 right-[50px] bottom-[50px] bg-(--bg-secondary) rounded-[25px]' ref={infoWindowRef}>
                    
                    {selectedElementInfo && (
                        <div>
                            {Object.entries(selectedElementInfo)
                            .filter(([key, value]) => (key === '_category' || key === '_localId' || key === 'Name'))
                            .map(([key, value]) => (
                                <div key={key} className='text-lg text-(--text-primary)'>
                                    <span style={{ fontWeight: 700 }}>{
                                    key === '_category' ? 'Категория' :
                                    key === '_localId' ? 'ID' :
                                    key === 'Name' ? 'Имя': 
                                    null
                                }: </span>
                                <span>{Object.entries(value).map(([key, value]) => (value))}</span>
                                </div>
                            )
                            )}
                    </div>)}
                </div>
            </>
        )

    }

}


export default InfoCurrentElement
