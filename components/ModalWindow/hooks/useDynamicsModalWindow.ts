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

        const rect = modalWindowRef.current?.getBoundingClientRect()
        if (!rect) return
        
        setSize(prevSize => {
            
            const newSize = { ...prevSize }
            const currentPosition = { ...positionRef.current }
        
    
            const screenWidth = window.innerWidth
            const screenHeight = window.innerHeight

        switch(direction) {
            case 'top':
                newSize.height = Math.max(initialSize.height, Math.min(rect.bottom - (rect.top + deltaY), rect.bottom))
                currentPosition.y = Math.max(0, Math.min(currentPosition.y + deltaY, rect.bottom - initialSize.height))
                break
            case 'right':
                newSize.width = Math.max(initialSize.width, Math.min(rect.width + deltaX, screenWidth - rect.left - 8))
                break
            case 'bottom':
                newSize.height = Math.max(initialSize.height, (Math.min(rect.bottom + deltaY, screenHeight - 8) - rect.top))
                break
            case 'left':
                newSize.width = Math.max(initialSize.width, Math.min(rect.width - deltaX, rect.right))
                currentPosition.x = Math.max(0, Math.min(rect.left + deltaX, rect.right - initialSize.width))
                break
            case 'top-left':
                newSize.height = Math.max(initialSize.height, Math.min(rect.bottom - (rect.top + deltaY), rect.bottom))
                newSize.width = Math.max(initialSize.width, Math.min(rect.width - deltaX, rect.right))
                currentPosition.y = Math.max(0, Math.min(currentPosition.y + deltaY, rect.bottom - initialSize.height))
                currentPosition.x = Math.max(0, Math.min(rect.left + deltaX, rect.right - initialSize.width))
                break
            case 'top-right':
                newSize.height = Math.max(initialSize.height, Math.min(rect.bottom - (rect.top + deltaY), rect.bottom))
                newSize.width = Math.max(initialSize.width, Math.min(rect.width + deltaX, screenWidth - rect.left))
                currentPosition.y = Math.max(0, Math.min(currentPosition.y + deltaY, rect.bottom - initialSize.height))
                break
            case 'bottom-left':
                newSize.height = Math.max(initialSize.height, (Math.min(rect.bottom + deltaY, screenHeight - 8) - rect.top))
                newSize.width = Math.max(initialSize.width, Math.min(rect.width - deltaX, rect.right))
                currentPosition.x = Math.max(0, Math.min(rect.left + deltaX, rect.right - initialSize.width))
                break
            case 'bottom-right':
                newSize.height = Math.max(initialSize.height, (Math.min(rect.bottom + deltaY, screenHeight - 8) - rect.top))
                newSize.width = Math.max(initialSize.width, Math.min(rect.width + deltaX, screenWidth - rect.left - 8))
                break    
            }

            setPosition(currentPosition)
            return newSize
        })

    }, [])

    const handleDrag = useCallback((deltaX: number, deltaY: number) => {
        
        const rect = modalWindowRef.current?.getBoundingClientRect()
        if (!rect) return
        
        const screenWidth = document.documentElement.clientWidth
        const screenHeight = document.documentElement.clientHeight

        const maxX = screenWidth - Math.floor(rect.width) - 8 // - 8 для обхода скроллбара
        const maxY = screenHeight - Math.floor(rect.height) - 8
        console.log([rect, maxX, maxY, screenHeight])

        setPosition(prev => ({
            x: Math.max(0, Math.min(prev.x + deltaX, maxX)),
            y: Math.max(0, Math.min(prev.y + deltaY, maxY))
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
