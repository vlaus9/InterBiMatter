import { useRef, useCallback, useState, useEffect } from 'react'

interface IPosition {
    x: number
    y: number
}

interface ISize {
    width: number
    height: number
}

const useDynamicsModalWindow = (initialPosition: IPosition = {x: 200, y: 200}) => {

    const modalWindowRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<IPosition>(initialPosition);
    const [size, setSize] = useState<ISize>({width: 600, height: 800});

    const positionRef = useRef(position)

    useEffect(() => {
        positionRef.current = position
    }, [position])

    const handleResize = useCallback((direction: string, deltaX: number, deltaY: number) => {

        setSize(prevSize => {
            const newSize = { ...prevSize }
            const currentPosition = { ...positionRef.current }
    

        switch(direction) {
            case 'top':
                newSize.height = Math.max(500, prevSize.height - deltaY)
                currentPosition.y += deltaY
                break
            case 'right':
                newSize.width = Math.max(400, prevSize.width + deltaX)
                break
            case 'bottom':
                newSize.height = Math.max(500, prevSize.height + deltaY)
                break
            case 'left':
                newSize.width = Math.max(400, prevSize.width - deltaX)
                currentPosition.x += deltaX
                break
            case 'top-left':
                newSize.height = Math.max(500, prevSize.height - deltaY)
                newSize.width = Math.max(400, prevSize.width - deltaX)
                currentPosition.y += deltaY
                currentPosition.x += deltaX
                break
            case 'top-right':
                newSize.width = Math.max(300, prevSize.width + deltaX)
                newSize.height = Math.max(200, prevSize.height - deltaY)
                currentPosition.y += deltaY
                break
            case 'bottom-left':
                newSize.width = Math.max(300, prevSize.width - deltaX)
                newSize.height = Math.max(200, prevSize.height + deltaY)
                currentPosition.x += deltaX
                break
            case 'bottom-right':
                newSize.width = Math.max(300, prevSize.width + deltaX)
                newSize.height = Math.max(200, prevSize.height + deltaY)
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
