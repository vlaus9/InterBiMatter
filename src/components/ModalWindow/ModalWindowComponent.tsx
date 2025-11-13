import type { IModalWindow } from "./types/ModalWindowTypes"
import ModalWindowDraggingFrame from "./move/ModalWindowDraggingFrame"
import  useDynamicsModalWindow from './hooks/useDynamicsModalWindow'
import useDragResize from './hooks/useDragResize'
import { CloseOutlined } from '@ant-design/icons'
import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { isClosed } from "./slices/isOpenModalWindowSlice"
import './styles/ModalWindowStyles.css'


export interface IModalWindowProps {
    config: IModalWindow
}

const ModalWindow: React.FC<IModalWindowProps> = ({ config }) => {

    const { modalWindowRef, position, size, handleResize, handleDrag } = useDynamicsModalWindow()
    const { onResizeStart, onDragStart } = useDragResize(handleResize, handleDrag)
    const { isOpen } = useAppSelector((state) => state.isOpenModalWindowSlice)
    const dispatch = useAppDispatch()

    if (!isOpen) return

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
            className={`modal-window-opening absolute bg-[var(--bg-secondary)] rounded-[25px]`}>
               <header onMouseDown={onDragStart} className='flex items-center justify-between cursor-all-scroll h-[40px] bg-[var(--bg-primary)] rounded-t-[25px]'>
                    <div className={'w-[10px]'}></div>
                    <h1 className='text-xl text-[var(--text-primary)] '>{config.name}</h1>
                    <CloseOutlined className={'scale-[1.3] mr-[20px] hover:cursor-pointer hover:scale-[1.5] transition-all'} style={{ color: 'white'}} 
                    onClick={() => {
                        modalWindowRef.current?.classList.replace('modal-window-opening', 'modal-window-closing')
                        setTimeout(() => dispatch(isClosed()), 90)
                        }}/>
               </header>

               <ModalWindowDraggingFrame onResizeStart={onResizeStart} />
                
            </div>
        </>
    )
}

export default ModalWindow

