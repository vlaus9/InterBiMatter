import { useState } from "react"
import { useAppDispatch } from "../../../../app/hooks"
import { addSelectProperties, delSelectProperties } from "../slices/selectPropertiesSlice"
import type { ISelectPropertiesComponentProps } from "../types/types"

const SelectProperties: React.FC<ISelectPropertiesComponentProps> = ({ allColumns, initialSelectColumns }) => {
    
    const dispatch = useAppDispatch()
    
    return (
        <div className='absolute top-[-450px] right-[100px] w-[450px] h-[400px] bg-(--bg-secondary) rounded-[15px]'>
            <div className='text-center p-2 h-[10%]'>
                <p className='text-[#f5f5f5] text-lg'>Выбрать свойства</p>
            </div>

            <div className='w-full h-[90%] p-2'>
                <div className='w-full h-full bg-(--project-versions-hover-bg) rounded-[15px] flex flex-col overflow-auto'>
                    {allColumns.map((el) => (
                        <label className={`flex gap-3 w-[95%] h-20 whitespace-nowrap mx-2 my-1.5 px-2 py-1 rounded-[15px] bg-(--model-properties-table-bg) hover:bg-[#676767] hover:scale-[1.015] hover:text-[#f5f5f5] transition-all`}>

                            <input 
                            checked={initialSelectColumns.includes(el)} 
                            onChange={() => {
                                if (initialSelectColumns.includes(el)) {
                                    dispatch(delSelectProperties(el))
                                } else {
                                    dispatch(addSelectProperties(el))
                                }
                            }}
                            type='checkbox' key={el} className='hidden peer'></input>

                            <div className='opacity-0 -translate-x-11.25 peer-checked:translate-x-0 peer-checked:opacity-100 transition-all'>
                                <svg className="w-6 h-6 scale-[0.7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                                </svg>
                            </div>
                            
                            <span className='-translate-x-7.5 peer-checked:translate-x-0 transition-all'>{el}</span>
                        </label>
                    ))}
                </div>
            </div>
            
        </div>

    )
}

export default SelectProperties