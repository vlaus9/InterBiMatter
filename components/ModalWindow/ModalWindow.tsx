import type { IModalWindow } from "./types/ModalWindowTypes"
import ModalWindowDraggingFrame from "./ModalWindowDraggingFrame"
import  useDynamicsModalWindow from './hooks/useDynamicsModalWindow'
import useDragResize from './hooks/useDragResize'


export interface IModalWindowProps {
    config: IModalWindow
}

const ModalWindow: React.FC<IModalWindowProps> = ({ config }) => {

    const { modalWindowRef, position, size, handleResize, handleDrag } = useDynamicsModalWindow()
    const { onResizeStart, onDragStart } = useDragResize(handleResize, handleDrag)

    return (
        <>
            <div ref={modalWindowRef} className={`absolute left-[200px] top-[200px] w-[40vw] h-[60vh] bg-[var(--bg-secondary)] rounded-[25px]`}>
               <header onMouseDown={onDragStart} className='flex items-center justify-center h-[40px] bg-[var(--bg-primary)] rounded-t-[25px] '>
                    <h1 className='text-xl text-[var(--text-primary)]'>{config.name}</h1>
               </header>

               <ModalWindowDraggingFrame onResizeStart={onResizeStart} />
                
            </div>
        </>
    )
}

export default ModalWindow



