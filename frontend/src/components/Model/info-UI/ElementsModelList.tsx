import { useState, useEffect } from "react"
import * as FRAGS from "@thatopen/fragments"
import { editor } from "../editing/usePropertiesEditor"
import { List } from 'react-window'
import type { RowComponentProps } from "react-window"

type RowData = [string, string, number]

const ElementsModelList: React.FC = () => {

    const [elementsModelList, setElementsModelList] = useState<FRAGS.ItemData[] | null>(null)
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
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
            className={`grid grid-cols-[15%_45%_30%_10%] items-center border-b cursor-pointer hover:bg-[#5f5f64] ${selectedItems.has(data[index][2]) ? 'bg-[#6b6b70]' : ''}`} style={style}
            onClick={() => {
                const id = data[index][2]
                const newSelected = new Set(selectedItems)

                if (newSelected.has(id)) {
                    newSelected.delete(id)
                } else {
                    newSelected.add(id)
                }

                setSelectedItems(newSelected)
                editor.selectItemFromTable([id])
            }}
            key={index}
            >
                <span className='p-[10px] m-x-[5px] border-r'>{index + 1}</span>
                <span className='whitespace-nowrap overflow-x-scroll p-[10px] m-x-[5px] border-r '>{data[index][0]}</span>
                <span className='overflow-x-scroll p-[10px] ml-[5px] border-r'>{data[index][1]}</span>
                <span className='p-[10px] ml-[5px]'>{data[index][2]}</span>
            </div>

        )
    }

    // grid-cols-[minmax(40px,60px)_minmax(200px,1fr)_0.6fr_120px]

    // if (!elementsModelList) {
    //     return (
    //         <>
    //             <div className='w-full h-full bg-white'>
    //                 <p>Загрузка...</p>
    //             </div>
    //         </>
    //     )
    // } else {
        return (
            <>
                <div className='h-full w-full p-[15px]'>
                    <div className='h-[85%] m-[20px] overflow-auto'>
                        <button onClick={() => { 
                            for (const el of selectedItems) {
                                editor.resetElementFromTable([el])
                            }
                            
                            console.log('кликнул')
                        }}>Сбросить</button>
                        <div className='grid grid-cols-[15%_45%_30%_10%] items-center border-b [&_span]:!font-bold [&_span]:!text-lg'>
                            <span className='p-[10px] m-x-[5px] border-r'>№</span>
                            <span className='p-[10px] m-x-[5px] border-r'>Наименование</span>
                            <span className='p-[10px] m-x-[5px] border-r'>Категория</span>
                            <span className='p-[10px] m-x-[5px]'>Id</span>
                        </div>
                        <List rowCount={box.length} rowHeight={40} rowComponent={Row} rowProps={{ data: box }} />
                    </div>

                </div>
            </>
        )
    }


export default ElementsModelList
