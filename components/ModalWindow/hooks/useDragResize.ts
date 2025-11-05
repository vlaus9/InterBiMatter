import { useCallback } from "react";

const useDragResize = (
    onResize: (direction: string, deltaX: number, deltaY: number) => void,
    onDrag: (deltaX: number, deltaY: number) => void
    ) => {


    const onResizeStart = useCallback((direction: string) => (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        const startX = e.clientX
        const startY = e.clientY

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX
            const deltaY = moveEvent.clientY - startY
            onResize(direction, deltaX, deltaY)
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

        const startX = e.clientX
        const startY = e.clientY

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX
            const deltaY = moveEvent.clientY - startY
            onDrag(deltaX, deltaY)
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