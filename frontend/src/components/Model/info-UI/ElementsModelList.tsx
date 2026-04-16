import { useState, useEffect } from "react"
import * as FRAGS from "@thatopen/fragments"
import { editor } from "../editing/usePropertiesEditor"
import { List } from "react-window"
import type { RowComponentProps } from "react-window"
import "./style/elementModelList.css"
import { useAppSelector, useAppDispatch } from "../../../app/hooks"
import { addElem, delElem, clearAll, invisible, visible, makeWireFrame, delWireFrame, makeOpacity, delOpacity } from "../slice/elementsModelListSlice"

type RowData = [string, string, number]

const ElementsModelList: React.FC = () => {

    const dispatch = useAppDispatch()
    const [elementsModelList, setElementsModelList] = useState<FRAGS.ItemData[] | null>(null)
    const selectedItems = useAppSelector<number[]>((state) => state.elementsModelListSlice.selectedElem)
    const isMakeInvisible = useAppSelector<boolean>((state) => state.elementsModelListSlice.isMakeInvisible)
    const isWireFrame = useAppSelector<boolean>((state) => state.elementsModelListSlice.isWireFrame)
    const isOpacity = useAppSelector<boolean>((state) => state.elementsModelListSlice.isMakeOpacity)
    const box: RowData[] = []

    useEffect(() => {
        //получение списка элементов
        editor.elementsModelList = (data: FRAGS.ItemData[]) => {
            setElementsModelList(data)
        }

        editor.getElementsModel()
        
        return () => {
            editor.elementsModelList = null
        }

    }, [])

    //перекидываем все в box чтобы легче было рендерить
    if (elementsModelList) {
            elementsModelList.map((el: any) => {
                if (!el._guid.value || !el.Name || !el.Name.value || !el._category.value || !el._localId.value) return
                box.push([el.Name.value, el._category.value, el._localId.value])
            })
    }
    

    //функция для отображения списка
    const Row = ({ index, data, style }: RowComponentProps<{ data: RowData[]}>) => {
        return (
            <div 
            className={`grid grid-cols-[15%_45%_30%_10%] items-center border-b cursor-pointer hover:bg-[#5f5f64] ${selectedItems.includes(data[index][2]) ? 'bg-[#6b6b70]' : 'white'}`} style={style}
            onClick={() => {
                const id = data[index][2]

                if (selectedItems.includes(id)) {
                    dispatch(delElem(id))
                    editor.resetElementFromTable([id])
                } else {
                    dispatch(addElem(id))
                    if (isWireFrame) {
                        editor.makeWireFrame()
                    }
                    editor.selectItemFromTable([id])
                    
                }
                
                // setSelectedItems(newSelected)
            }}
            key={index}
            >
                <span className='flex items-center h-full pl-[10px] m-x-[5px] border-r'>{index + 1}</span>
                <span className='flex items-center h-full pl-[10px] m-x-[5px] whitespace-nowrap custom-scroll-thin overflow-x-auto border-r '>{data[index][0]}</span>
                <span className='flex items-center h-full pl-[10px] m-x-[5px] custom-scroll-thin overflow-x-auto border-r'>{data[index][1]}</span>
                <span className='flex items-center h-full pl-[10px] ml-[5px]'>{data[index][2]}</span>
            </div>

        )
    }

        return (
            <>
                <div className='h-full w-full p-[15px]'>
                    <div className='h-[70%] m-[20px] '>
                        <div className='flex justify-between mb-[10px] whitespace-nowrap overflow-auto border-b  pb-[20px]'>
                            <button className={`px-[10px] py-[5px] border rounded-[15px] cursor-pointer hover:bg-[#5f5f64] ${isWireFrame && 'bg-[#A5A5A5]'}`} onClick={() => {
                                if (!isWireFrame) {
                                    dispatch(makeWireFrame())
                                    editor.makeWireFrame()
                                } else {
                                    dispatch(delWireFrame())
                                    editor.delWireFrame()
                                }
                            }}>
                                Каркасный режим выделения
                            </button>
                            <button className='ml-[20px] px-[10px] py-[5px] border rounded-[15px] cursor-pointer hover:bg-[#5f5f64]' onClick={() => { 
                                for (const el of selectedItems) {
                                    editor.resetElementFromTable([el])
                                    console.log(el)
                                }
                                dispatch(clearAll())
                            }}>Сбросить выделение
                            </button>
                            <button className={`ml-[20px] px-[10px] py-[5px] border rounded-[15px] cursor-pointer hover:bg-[#5f5f64] ${isOpacity && 'bg-[#A5A5A5]'}`} onClick={() => { 
                                if (!isOpacity) {
                                    editor.makeOpacity(box.filter((el) => !selectedItems.includes(el[2])))
                                    dispatch(makeOpacity())
                                } else {
                                    editor.delOpacity()
                                    dispatch(delOpacity())
                                }
                            }}
                            >
                                Прозрачный режим
                            </button>
                            <button  className={`ml-[20px] px-[10px] py-[5px] border rounded-[15px] cursor-pointer hover:bg-[#5f5f64] ${isMakeInvisible && 'bg-[#A5A5A5]'}`}
                            onClick={(() => {
                                if (!isMakeInvisible) {
                                    editor.makeInvisible()
                                    dispatch(invisible())
                                } else {
                                    editor.makeVisible()
                                    dispatch(visible())
                                }
                            })}>
                                {!isMakeInvisible ? 'Скрыть невыделенное' : 'Показать невыделенное'}
                            </button>
                        </div>
                        <div className='custom-scroll-unvisible grid grid-cols-[15%_45%_30%_10%] items-center border-b [&_span]:!font-bold [&_span]:!text-lg'>
                            <span className='p-[10px] m-x-[5px] border-r'>№</span>
                            <span className='p-[10px] m-x-[5px] border-r'>Наименование</span>
                            <span className='p-[10px] m-x-[5px] border-r'>Категория</span>
                            <span className='p-[10px] m-x-[5px]'>Id</span>
                        </div>
                        <List rowCount={box.length} rowHeight={50} rowComponent={Row} rowProps={{ data: box }} className='custom-scroll' />
                    </div>

                </div>
            </>
        )
    }


export default ElementsModelList
