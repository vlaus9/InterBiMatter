import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef, useState, useEffect, useCallback} from "react"
import type { VirtualTableProps } from "../types/types"
import { resize } from "framer-motion"

const VirtualTable: React.FC<VirtualTableProps> = ({ columns, data, rowHeight = 45 , overscan = 3, containerHeight = 300, defaultColumnWidth = 120 }) => {

    const containerRef = useRef<HTMLDivElement>(null)
    const [columnsWidth, setColumnsWidth] = useState<Record<string, number>>({})
    const [resizing, setResizing] = useState<string | null>(null)
    const [resizeStartX, setResizeStartX] = useState<number>(0)
    const [resizeStartWidth, setResizeStartWidth] = useState<number>(0)

    // Вычисление ширины колонок
    const calculateColumnsWidth = useCallback(() => {
        const widths: Record<string, number> = {}

            columns.forEach(col => {
                const headerWidth = col.length * 14 + 32
                
                let width = Math.max(headerWidth, 60)
                width = Math.min(width, 500)

                widths[col] = Math.round(width)
            })

        return widths

    }, [columns, data])

    useEffect(() => {
        setColumnsWidth(calculateColumnsWidth())
    }, [])


    // Старт изменения ширины колонки
    const handleResizeStart = (e: React.MouseEvent, colKey: string) => {
        e.preventDefault()
        setResizing(colKey)
        setResizeStartX(e.clientX)
        setResizeStartWidth(columnsWidth[colKey] || defaultColumnWidth)
    }


    // Изменение ширины колонки
    const handleResizeMove = useCallback((e: MouseEvent) => {

        if (!resizing) return

        const delta = e.clientX - resizeStartX
        
        let newWidht = Math.max(60, resizeStartWidth + delta)
        newWidht = Math.min(500, newWidht)

        setColumnsWidth(prev => ({
            ...prev,
            [resizing]: newWidht
        }))

    }, [resizing, resizeStartX, resizeStartWidth])
    

    // Конец изменения ширины колонки
    const handleResizeEnd = useCallback(() => {
        setResizing(null)
    },[])


    useEffect(() => {
        if (resizing) {
            document.addEventListener('mousemove', handleResizeMove)
            document.addEventListener('mouseup', handleResizeEnd)
            document.body.style.cursor = 'col-resize'
            document.body.style.userSelect = 'none'
        }
        return () => {
            document.removeEventListener('mousemove', handleResizeMove)
            document.removeEventListener('mouseup', handleResizeEnd)
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
        }
    }, [resizing, handleResizeMove, handleResizeEnd])


    // Получение только видимых пользователю данных
    const rowVirtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => containerRef.current,
        estimateSize: () => rowHeight,
        overscan: overscan
    })

    const columnsVirtualizer = useVirtualizer({
        horizontal: true,
        count: columns.length,
        getScrollElement: () => containerRef.current,
        estimateSize: (index) => {
            const col = columns[index]
            return columnsWidth[col] || defaultColumnWidth
        },
        overscan: Math.min(overscan, 2)
    })

    const virtualRows = rowVirtualizer.getVirtualItems()
    const virtualColumns = columnsVirtualizer.getVirtualItems()


    // Обновляем чтобы при изменении ширины колонки не дергалось
    useEffect(() => {
        columnsVirtualizer.measure()
    }, [columnsWidth])

    return (
        <div
            ref={containerRef}
            className={`relative overflow-auto border`}
            style={{ height: containerHeight }}
            >
                <table className='w-full border-collapse table-fixed'>
                    <thead className='sticky top-0 z-10'>
                        <tr>

                            {/* Заглушка слева для скролла */}
                            {virtualColumns.length > 0 && (
                                <th
                                    key={`header-spacer-start-${virtualColumns[0].start}`}
                                    className='p-0 border-none'
                                    style={{ 
                                        width: virtualColumns[0]?.start || 0, 
                                        minWidth: virtualColumns[0]?.start || 0
                                    }}
                                />
                            )}

                            {/* Заглушка над номерами строк */}
                            <th className='w-15 border-r border-r-black relative px-2 py-2 backdrop-blur-2xl bg-black/30'>      
                            </th>


                            {/* Шапка (названия колонок) */}
                            {virtualColumns.map(virtualCol => {
                                const col = columns[virtualCol.index]
                                const width = columnsWidth[col] || defaultColumnWidth

                                return (
                                    <th 
                                    key={`${col}-${virtualCol.index}`}
                                    className='relative px-2 py-2 backdrop-blur-2xl bg-black/30 overflow-hidden whitespace-nowrap border-r border-r-black'
                                    style={{
                                        width: `${width}px`,
                                        minWidth: `${width}px`,
                                        maxWidth:`${width}px`,
                                    }}
                                    >
                                        <div className='flex items-center justify-center gap-1'>
                                            <span className='overflow-hidden text-ellipsis whiteespace-nowrap flex-1'>
                                                {col}
                                            </span>
                                            <div 
                                            onMouseDown={(e) => handleResizeStart(e, col)}
                                            onMouseEnter={(e) => { if (!resizing) e.currentTarget.style.background = '#c0c0c0' }}
                                            onMouseLeave={(e) => { if (!resizing) e.currentTarget.style.background = 'bg-transparent' }}
                                            className={`w-1.5 h-6 cursor-col-resize ${resizing === col ? 'bg-[#3b82f6]' : 'bg-transparent'} rounded-xs shrink-0 transition-all`}
                                            />
                                        </div>
                                    </th>
                                )
                            }
                            )}


                            {/* Заглушка справа для скролла */}
                            {virtualColumns.length > 0 && (
                                <th
                                    key={`header-spacer-end-${virtualColumns[virtualColumns.length - 1]?.start || 0}`}
                                    className='p-0 border-none min-w-0'
                                    style={{ 
                                        width: columnsVirtualizer.getTotalSize() - (virtualColumns[virtualColumns.length - 1]?.start || 0) - (virtualColumns[virtualColumns.length - 1]?.size || 0), 
                                    }}
                                />
                            )}

                        </tr>
                    </thead>

                    <tbody>

                        {/* Создает "дыру" над видимыми строками, чтобы скролл работал.
                        Без нее скролл-бар не будет знать, сколько места нужно зарезервировать */}
                        {virtualRows.length > 0 && (

                            <tr>
                                <td 
                                key={`row-spacer-start-${virtualRows[0].start}`}
                                colSpan={columns.length} style={{height: virtualRows[0].start || 0}}></td>
                            </tr>

                        )}    

                            {/* Строки */}
                            {virtualRows.map((virtualRow) => {
                                const row = data[virtualRow.index]
                                return (
                                    <tr key={virtualRow.key} 
                                    >

                                        {/* Заглушка слева */}
                                        {virtualColumns.length > 0 && (
                                            <td
                                                key={`row-spacer-left-${virtualRow.index}-${virtualColumns[0]?.start || 0}`}
                                                className='p-0 border-none'
                                                style={{
                                                    width: virtualColumns[0].start
                                                }}
                                            />
                                        )}


                                        {/* Нумерация строк */}
                                        <td className='w-15 border border-white/30 text-center bg-[#908b8bd6]'>
                                            {virtualRow.index + 1}
                                        </td>
                                        

                                        {/* Ячейки */}
                                        {virtualColumns.map(virtualCol => {
                                            const col = columns[virtualCol.index]
                                            const width = columnsWidth[col] || defaultColumnWidth
                                            const value = row[col]
                                            return (
                                                <td
                                                key={`${col}-${virtualRow.index}`}
                                                className={`px-2 border border-white/30 overflow-hidden text-ellipsis whitespace-nowrap ${columns.indexOf(col) % 2 === 0 ? 'bg-[#acacacd6]' : 'bg-[#908b8bd6]'}`}
                                                style={{ 
                                                width: `${width}px`,
                                                minWidth: `${width}px`,
                                                maxWidth: `${width}px`,
                                                height: `${rowHeight}px`,
                                                }}>
                                                    {value !== undefined && value !== null ? String(value) : '-'}

                                                </td>
                                            )
                                        })}


                                        {/* Заглушка справа */}
                                        {virtualColumns.length > 0 && (
                                            <td
                                                key={`row-spacer-right-${virtualRow.index}-${virtualColumns[virtualColumns.length - 1]?.start || 0}`}
                                                className='p-0 border-none'
                                                style={{
                                                    width: Math.max(0, columnsVirtualizer.getTotalSize() - (virtualColumns[virtualColumns.length - 1]?.start || 0) - (virtualColumns[virtualColumns.length - 1]?.size || 0))
                                                }}
                                            />
                                        )}

                                    </tr>
                                )
                            })}


                           {/* Создает "дыру" под видимыми строками, чтобы скролл работал до самого низа.
                           Высота = общая высота всех строк - уже отрендеренная часть. */}
                            {virtualRows.length > 0 && (
                                <tr>
                                    <td
                                    key={`row-spacer-end-${virtualRows[virtualRows.length - 1]?.start || 0}`}
                                    colSpan={columns.length}
                                    style={{
                                        height: rowVirtualizer.getTotalSize() - (virtualRows[virtualRows.length - 1]?.start || 0) - (virtualRows[virtualRows.length - 1]?.size || 0)
                                    }}>
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </table>


                {/* Индикатор ресайза */}
                {/* {resizing && (
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        bottom: '0',
                        left: `${resizeStartX + (columnsWidth[resizing] || 0) - resizeStartWidth}px`,
                        width: '2px',
                        background: '#3b82f6',
                        pointerEvents: 'none',
                        zIndex: 50
                    }}>
                    </div>
                )} */}

        </div>
    )
}

export default VirtualTable