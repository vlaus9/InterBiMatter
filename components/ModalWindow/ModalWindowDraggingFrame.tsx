import { useRef } from 'react'

const ModalWindowDraggingFrame: React.FC = () => {

    const refs = useRef<(HTMLDivElement | null)[]>([])


    return (
        <>
            <div ref={el => {refs.current[0] = el}} className='top-border absolute left-[5%] right-[5%] top-[-8px] h-[16px] bg-[green] cursor-row-resize'></div>
            <div ref={el => {refs.current[1] = el}} className='right-border absolute top-[5%] bottom-[5%] right-[-8px] w-[16px] bg-[green] cursor-col-resize'></div>
            <div ref={el => {refs.current[2] = el}} className='bottom-border absolute left-[5%] right-[5%] bottom-[-8px] h-[16px] bg-[green] cursor-row-resize'></div>
            <div ref={el => {refs.current[3] = el}} className='left-border absolute top-[5%] bottom-[5%] left-[-8px] w-[16px] bg-[green] cursor-col-resize'></div>

            <div className='left-top absolute left-[-7px] top-[-7px] w-[25px] h-[25px] bg-[green] cursor-nwse-resize'></div>
            <div className='right-top absolute right-[-7px] top-[-7px] w-[25px] h-[25px] bg-[green] cursor-nesw-resize'></div>
            <div className='right-bottom absolute right-[-7px] bottom-[-7px] w-[25px] h-[25px] bg-[green] cursor-nwse-resize'></div>
            <div className='left-top absolute left-[-7px] bottom-[-7px] w-[25px] h-[25px] bg-[green] cursor-nesw-resize'></div>
        </>
    )
}

export default ModalWindowDraggingFrame

//true если нажали и запускается dragstart если потянули то запускается dragging