import { useState, useEffect } from "react"
import * as FRAGS from "@thatopen/fragments"
import { editor } from "../editing/usePropertiesEditor"
import { List } from 'react-window'
import type { RowComponentProps } from "react-window"


interface IRow {
    index: number,
    style: string
}

const ElementsModelList: React.FC = () => {

    const [elementsModelList, setElementsModelList] = useState<FRAGS.ItemData[] | null>(null)
    const box: string[][] = []

    useEffect(() => {
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
            console.log(elementsModelList)
            elementsModelList.map((el: any) => {
                if (!el._guid.value || !el.Name || !el.Name.value || !el._category.value || !el._localId.value) return
                box.push([el.Name.value, el._category.value, el._localId.value])
            })
            console.log(box)
    }

    const Row = ({ index, data, style }: RowComponentProps<{ data: string[][]}>) => {
        return (
            <div className='grid grid-cols-[minmax(40px,60px)_minmax(200px,1fr)_0.6fr_120px]  items-center border-b' style={style}>
                <span className='p-[10px] m-x-[5px] border-r'>{index + 1}</span>
                <span className='whitespace-nowrap overflow-x-scroll p-[10px] m-x-[5px] border-r '>{data[index][0]}</span>
                <span className='p-[10px] ml-[5px] border-r'>{data[index][1]}</span>
                <span className='p-[10px] ml-[5px]'>{data[index][2]}</span>
            </div>

        )
    }


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
                <div className='custom-scroll h-full w-full p-[15px]'>
                    <div className='h-[90%] m-[20px] overflow-auto'>
                        <List rowCount={box.length} rowHeight={80} rowComponent={Row} rowProps={{ data: box }} />
                    </div>

                </div>
            </>
        )
    }


export default ElementsModelList
