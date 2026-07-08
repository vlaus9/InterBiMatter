import { createSlice } from "@reduxjs/toolkit"

interface ISelectProperties {
    selectProperties: string[],
    allProperties: string[]
}

const initialState: ISelectProperties = {
    selectProperties: [],
    allProperties: []
}

const selectProperties = createSlice({
    name: 'selectPropertiesSlice',
    initialState,
    reducers: {
        addAllProperties: (state, action) => {
            state.allProperties = action.payload
            state.selectProperties = Array(action.payload.length).fill('')
        },
        addSelectProperties: (state, action) => {
            state.selectProperties[state.allProperties.indexOf(action.payload)] = action.payload
        },
        delSelectProperties: (state, action) => {
            state.selectProperties[state.allProperties.indexOf(action.payload)] = ''
        }
    }
})

export const { addAllProperties, addSelectProperties, delSelectProperties } = selectProperties.actions
export default selectProperties.reducer

