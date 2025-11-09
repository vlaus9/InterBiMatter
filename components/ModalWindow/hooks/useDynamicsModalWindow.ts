import { useRef, useCallback, useState, useEffect } from 'react'

interface IPosition {
    x: number
    y: number
}

interface ISize {
    width: number
    height: number
}

const useDynamicsModalWindow = (
    initialPosition: IPosition = { x: 200, y: 200 },
    initialSize: ISize = { width: window.innerWidth / 2, height: window.innerHeight / 1.5 }
    ) => {

    const modalWindowRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<IPosition>(initialPosition);
    const [size, setSize] = useState<ISize>(initialSize);

    const positionRef = useRef(position)
    const sizeRef = useRef(size)

    useEffect(() => {
        positionRef.current = position
    }, [position])

    useEffect(() => {
        sizeRef.current = size
    }, [size])

    const handleResize = useCallback((direction: string, deltaX: number, deltaY: number) => {

        setSize(prevSize => {
            const newSize = { ...prevSize }
            const currentPosition = { ...positionRef.current }

            let widthBlocked = false
            let heightBlocked = false
            
    

        switch(direction) {
            case 'top':
                newSize.height = Math.max(initialSize.height, prevSize.height - deltaY)
                heightBlocked = newSize.height === initialSize.height
                if (!heightBlocked) {
                    currentPosition.y = Math.max(0, currentPosition.y + deltaY)
                }
                break
            case 'right':
                newSize.width = Math.max(initialSize.width, prevSize.width + deltaX)
                break
            case 'bottom':
                newSize.height = Math.max(initialSize.height, prevSize.height + deltaY)
                break
            case 'left':
                newSize.width = Math.max(initialSize.width, prevSize.width - deltaX)
                widthBlocked = newSize.width === initialSize.width
                if (!widthBlocked) {
                    currentPosition.x += deltaX
                }
                break
            case 'top-left':
                newSize.height = Math.max(initialSize.height, prevSize.height - deltaY)
                newSize.width = Math.max(initialSize.width, prevSize.width - deltaX)

                heightBlocked = newSize.height === initialSize.height
                widthBlocked = newSize.width === initialSize.width

                if (!heightBlocked) {
                    currentPosition.y = Math.max(0, currentPosition.y + deltaY)
                }

                if (!widthBlocked) {
                    currentPosition.x += deltaX
                }
                break
            case 'top-right':
                newSize.width = Math.max(initialSize.width, prevSize.width + deltaX)
                newSize.height = Math.max(initialSize.height, prevSize.height - deltaY)
                heightBlocked = newSize.height === initialSize.height
                if (!heightBlocked) {
                    currentPosition.y = Math.max(0, currentPosition.y + deltaY)
                }
                break
            case 'bottom-left':
                newSize.width = Math.max(initialSize.width, prevSize.width - deltaX)
                newSize.height = Math.max(initialSize.height, prevSize.height + deltaY)
                widthBlocked = newSize.width === initialSize.width
                if (!widthBlocked) {
                    currentPosition.x += deltaX
                }
                break
            case 'bottom-right':
                newSize.width = Math.max(initialSize.width, prevSize.width + deltaX)
                newSize.height = Math.max(initialSize.height, prevSize.height + deltaY)
                break    
            }

            setPosition(currentPosition)
            return newSize
        })

    }, [])

    const handleDrag = useCallback((deltaX: number, deltaY: number) => {
        setPosition(prev => ({
            x: Math.max(0, prev.x + deltaX),
            y: Math.max(0, prev.y + deltaY)
        }))
    }, [])

    return {
        modalWindowRef,
        position,
        size,
        handleResize,
        handleDrag
    }
    
}

export default useDynamicsModalWindow
