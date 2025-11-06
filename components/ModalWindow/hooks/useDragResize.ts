import { useCallback } from "react";

const useDragResize = (
    onResize: (direction: string, deltaX: number, deltaY: number) => void,
    onDrag: (deltaX: number, deltaY: number) => void
    ) => {


    const onResizeStart = useCallback((direction: string) => (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        let startX = e.clientX
        let startY = e.clientY

        const handleMouseMove = (moveEvent: MouseEvent) => {
            let deltaX = moveEvent.clientX - startX
            let deltaY = moveEvent.clientY - startY
            onResize(direction, deltaX, deltaY)

            startX = moveEvent.clientX
            startY = moveEvent.clientY
            deltaX = 0
            deltaY = 0
        }

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }, [onResize])


    const onDragStart = useCallback((e: React.MouseEvent) => {

        e.preventDefault()

        let startX = e.clientX
        let startY = e.clientY

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX
            const deltaY = moveEvent.clientY - startY
            onDrag(deltaX, deltaY)

            startX = moveEvent.clientX
            startY = moveEvent.clientY
        }

        const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
            }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)

    }, [onDrag])

    return {
        onResizeStart,
        onDragStart
    }

}

export default useDragResize