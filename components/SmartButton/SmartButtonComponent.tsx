import type { ISmartButton } from "./types/SmartButtonTypes"


interface ISmartButtonProps {
    config: ISmartButton
}

const SmartButton: React.FC<ISmartButtonProps> = ({ config }) => {
    
    const IconButton = config.icon;
    const IconButtonProps = config.iconProps;

    return (
        <>
            <button className={`smart-button-${config.id} w-[50px] h-[50px] bg-[#2c2c30ff] rounded-[10px] absolute`}>
                <IconButton {...IconButtonProps} />
                <h1 className={'absolute top-[25px] translate-y-[-50%] left-[60px] whitespace-nowrap text-xl'}>{config.name}</h1>
            </button>
        </>
    )
} 

export default SmartButton

