import React from "react"
import { List } from "react-window"
import type { RowComponentProps } from "react-window"
import { useState, useEffect } from "react"
import type { IFlatElement } from "./types/types"
import { modelData } from "./services/ModelDataService"
import VirtualTable from "./services/VirtualTable"
import SelectProperties from "./services/SelectProperties"
import { addAllProperties, addSelectProperties } from "./slices/selectPropertiesSlice"
import { useAppSelector, useAppDispatch } from "../../../app/hooks"


const ModelPropertiesTable: React.FC = () => {
    const dispatch = useAppDispatch()

    const [data, setData] = useState<IFlatElement[]>([])
    const [columns, setColumns] = useState<string[]>([])
    const [search, setSearch] = useState<string>('')

    const filtereData = search.trim() ? modelData.getByName(search) : data

    const selectProperties = useAppSelector((state) => state.selectPropertiesSlice.selectProperties)
    const showProperties = selectProperties.filter(el => el !== '')

    const initSelectPropertiesService = (columns: string[]) => {
        dispatch(addAllProperties(columns))
        columns.slice(0, 10).map(el => dispatch(addSelectProperties(el)))
    }

    useEffect(() => {
        const flatData = modelData.getFlatData()
        const keys = modelData.getPropertyKeys().reverse()

        if(flatData.length > 0 && keys.length > 0) {
            setData(flatData)
            setColumns(keys)
            initSelectPropertiesService(keys)
        }
    },[modelData.onLoadDataEvent])

    if (!showProperties) return

    return (
        <>
            <div className='relative w-full h-[40vh] bg-(--model-properties-table-bg)'>
                <button>
                    Кнопка
                </button>
                <SelectProperties allColumns={columns} initialSelectColumns={showProperties}/>

               <VirtualTable 
               columns={showProperties}
               data={data}
               containerHeight={315}/>
            </div>
        </>
    )
}

export default ModelPropertiesTable






// const ModelPropertiesTable: React.FC = () => {

//     const [data, setData] = useState<IFlatElement[]>([])
//     const [columns, setColumns] = useState<string[]>([])
//     const [search, setSearch] = useState<string>('')

//     const filtereData = search.trim() ? modelData.getByName(search) : data


//     const Row = ({ index, propsData, style }
//         : RowComponentProps<{propsData: { data: IFlatElement[], columns: string[] }}>) => {

//             const cellData = propsData.data
//             const headerData = propsData.columns

//         return (
            
//             <tr>
//                 {headerData.map(col => (
//                     <td key={col}>{String(cellData[index][col])}</td>
//                 ))}
//             </tr>
//         )
//     }


//     useEffect(() => {
//         const flatData = modelData.getFlatData()
//         const keys = modelData.getPropertyKeys().reverse()

//         if(flatData.length > 0 && keys.length > 0) {
//             setData(flatData)
//             setColumns(keys)
//         }
//     },[modelData.onLoadDataEvent])

//     return (
//         <>
//             <div className='w-full h-[40vh] bg-(--model-properties-table-bg)'>

//                 <span className='w-full inline-block mt-1.5 mb-0.5  text-center'>
//                     <h1>Таблица свойств модели</h1>
//                 </span>
//                 <div>
//                     <input className='w-[500px] mt-1 mb-1.5 mx-2 px-2 py-0.5 border rounded-[15px] outline-cyan-50 ' placeholder='Поиск по имени...'></input>
//                 </div>


//                 <div className='overflow-auto h-[30vh]'>
//                     <table className=''>
//                         <thead className='sticky top-0 bg-[#949494] before:content-[""] before:absolute before:inset-0 before:border before:pointer-events-none '>
//                             <tr className='bg-inherit'>
//                                 {columns.map(col => (
//                                     <th key={col} className='py-1 px-1.5 text-left border-r whitespace-nowrap'>{col}</th>
//                                 ))}
//                             </tr>
//                         </thead>

//                         <List 
//                         rowCount={data.length}
//                         rowHeight={10}
//                         rowComponent={Row}
//                         rowProps={{propsData: { data: data, columns: columns }}}
//                         tagName='tbody'
//                         />
//                         {/* <tbody>
//                             {filtereData?.map(el => (
//                                 <tr key={el.id} className='bg-[#a2a2a2d6]'>

//                                     {columns.map(col => (
//                                         String(el[col]) !== 'undefined' ? 
//                                             <td key={col} className='py-1 px-1.5 text-left border-r border-t whitespace-nowrap'>{String(el[col])}</td>
//                                          : <td key={col} className='py-1 px-1.5 text-left border-r border-t whitespace-nowrap'> - </td>
//                                     ))}

//                                 </tr>
//                             ))}
//                         </tbody> */}
//                     </table>
//                 </div>
//             </div>
//         </>
//     )
// }