import { editor } from "../editing/usePropertiesEditor"
import { useState, useEffect, useRef } from "react"
import * as FRAGS from "@thatopen/fragments"

const InfoCurrentElement: React.FC = () => {
    
    const [showInfoWindow, setShowInfoWindow] = useState<boolean>(false)
    const [selectedElementInfo, setSelectedElementInfo] = useState<FRAGS.ItemData | null>(null)

    useEffect(() => {

        editor.informationSelectedItem = (data) => {
            setSelectedElementInfo(data)
            setShowInfoWindow(true)
        }

    }, [])

    

    return (
        <>
        </>
    )
}

