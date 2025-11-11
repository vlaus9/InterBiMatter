import type { IModalWindow } from "./types/ModalWindowTypes"
import ModalWindowDraggingFrame from "./ModalWindowDraggingFrame"
import  useDynamicsModalWindow from './hooks/useDynamicsModalWindow'
import useDragResize from './hooks/useDragResize'
import { CloseOutlined } from '@ant-design/icons'


export interface IModalWindowProps {
    config: IModalWindow
}

const ModalWindow: React.FC<IModalWindowProps> = ({ config }) => {

    const { modalWindowRef, position, size, handleResize, handleDrag } = useDynamicsModalWindow()
    const { onResizeStart, onDragStart } = useDragResize(handleResize, handleDrag)


    return (
        <>
            <div 
            ref={modalWindowRef} 
            style={{
                height: `${size.height}px`, 
                width: `${size.width}px`, 
                left: `${position.x}px`,
                top: `${position.y}px`
                }} 
            className={`absolute bg-[var(--bg-secondary)] rounded-[25px]`}>
               <header onMouseDown={onDragStart} className='flex items-center justify-between h-[40px] bg-[var(--bg-primary)] rounded-t-[25px]'>
                    <div className={'w-[10px]'}></div>
                    <h1 className='text-xl text-[var(--text-primary)]'>{config.name}</h1>
                    <CloseOutlined className={'scale-[1.5] mr-[25px] hover:cursor-pointer hover:scale-[1.7] transition-all'} style={{ color: 'white'}}/>
               </header>

               <ModalWindowDraggingFrame onResizeStart={onResizeStart} />
                
            </div>
        </>
    )
}

export default ModalWindow

