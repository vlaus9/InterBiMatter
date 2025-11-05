import { useRef } from 'react'

interface IModalWindowDraggingFrameProps {
    onResizeStart: (direction: string) => (e: React.MouseEvent) => void
}

const ModalWindowDraggingFrame: React.FC<IModalWindowDraggingFrameProps> = ({onResizeStart}) => {

    return (
        <>
            <div onMouseDown={onResizeStart('top')} className='top-border absolute left-[5%] right-[5%] top-[-8px] h-[16px] bg-[green] cursor-row-resize'></div>
            <div onMouseDown={onResizeStart('right')} className='right-border absolute top-[5%] bottom-[5%] right-[-8px] w-[16px] bg-[green] cursor-col-resize'></div>
            <div onMouseDown={onResizeStart('bottom')} className='bottom-border absolute left-[5%] right-[5%] bottom-[-8px] h-[16px] bg-[green] cursor-row-resize'></div>
            <div onMouseDown={onResizeStart('left')} className='left-border absolute top-[5%] bottom-[5%] left-[-8px] w-[16px] bg-[green] cursor-col-resize'></div>

            <div onMouseDown={onResizeStart('top-left')} className='top-left absolute left-[-7px] top-[-7px] w-[25px] h-[25px] bg-[green] cursor-nwse-resize'></div>
            <div onMouseDown={onResizeStart('top-right')} className='top-right absolute right-[-7px] top-[-7px] w-[25px] h-[25px] bg-[green] cursor-nesw-resize'></div>
            <div onMouseDown={onResizeStart('bottom-right')} className='bottom-right absolute right-[-7px] bottom-[-7px] w-[25px] h-[25px] bg-[green] cursor-nwse-resize'></div>
            <div onMouseDown={onResizeStart('bottom-left')} className='bottom-left absolute left-[-7px] bottom-[-7px] w-[25px] h-[25px] bg-[green] cursor-nesw-resize'></div>
        </>
    )
}

export default ModalWindowDraggingFrame

//true если нажали и запускается dragstart если потянули то запускается dragging