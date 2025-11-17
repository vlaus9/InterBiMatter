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

            const screenWidth = window.innerWidth
            const screenHeight = window.innerHeight

            const currentX = moveEvent.clientX
            const currentY = moveEvent.clientY

            let deltaX = currentX - startX
            let deltaY = currentY - startY

            if (currentX <= 0) {
                deltaX = -startX
            } else if (currentX >= screenWidth - 1) {
                deltaX = screenWidth - 1 - startX
            }

            if (currentY <= 0) {
                deltaY = -startY
            } else if (currentY >= screenHeight - 1) {
                deltaY = screenHeight - 1 - startY
            }

            onResize(direction, deltaX, deltaY)

            
            startX = moveEvent.clientX
            startY = moveEvent.clientY

            if (currentX <= 0) {
                startX = 0
            } else if (currentX >= screenWidth - 1) {
                startX = screenWidth - 1
            }

            if (currentY <= 0) {
                startY = 0
            } else if (currentY >= screenHeight - 1) {
                startY = screenHeight - 1
            }

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