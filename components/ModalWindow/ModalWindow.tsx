import type { IModalWindow } from "./types/ModalWindowTypes"
import ModalWindowDraggingFrame from "./ModalWindowDraggingFrame"

export interface IModalWindowProps {
    config: IModalWindow
}

const ModalWindow: React.FC<IModalWindowProps> = ({ config }) => {

    return (
        <>
            <div className={`absolute left-[200px] top-[200px] w-[40vw] h-[60vh] bg-[var(--bg-secondary)] rounded-[25px]`}>
               <header className='flex items-center justify-center h-[40px] bg-[var(--bg-primary)] rounded-t-[25px] '>
                    <h1 className='text-xl text-[var(--text-primary)]'>{config.name}</h1>
               </header>

               <ModalWindowDraggingFrame />
                
            </div>
        </>
    )
}

export default ModalWindow



