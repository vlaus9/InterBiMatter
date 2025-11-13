import type { ISmartButton } from "./types/SmartButtonTypes"
import { useState } from "react"
import { useAppDispatch } from "../../app/hooks"
import { isOpen } from "../ModalWindow/slices/isOpenModalWindowSlice"



interface ISmartButtonProps {
    config: ISmartButton
}

const SmartButton: React.FC<ISmartButtonProps> = ({ config }) => {
    
    const [isHover, setIsHover] = useState<boolean>(false);
    const dispatch = useAppDispatch()

    const IconButton = config.icon;
    const IconButtonProps = config.iconProps;

    return (
        <>
            <div 
            className={`inline-block transition-all ${isHover ? 'scale-[1.1] translate-x-[15px]' : 'scale-[1]'}`}
            onClick={() => dispatch(isOpen(config.contentData))}
            >
                <div 
                className={`flex items-center m-[5px] py-[5px] px-[10px] bg-[var(--bg-primary)] rounded-[15px] transition-all duration-300 ease-in-out ${isHover ? 'gap-[15px] shadow-[0_0_0_2px_#a29d9dd6]' : 'gap-0'} cursor-pointer`}
                onMouseEnter={() => {setIsHover(true)}}
                onMouseLeave={() => {setIsHover(false)}}
                >
                    <button className={`smart-button-${config.id} w-[40px] h-[40px] rounded-[10px] cursor-pointer`}>
                        <IconButton {...IconButtonProps} />
                    </button>
                    <h1 
                    className={`whitespace-nowrap text-xl text-[var(--text-primary)] transition-all duration-200 ease-in-out ${isHover ? 'opacity-100 translate-x-0 max-w-[200px] ' : 'opacity-0 translate-x-2 max-w-0'} `}
                    >
                    {config.name}
                    
                    </h1>
                </div>
            </div>
        </>
    )
} 

export default SmartButton

