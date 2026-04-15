import { createSlice } from "@reduxjs/toolkit";

const initialState: number[] = []

const elementsModelListSlice = createSlice({
    name: 'elementModelListSlice',
    initialState,
    reducers: {
        addElem: (state, action) => {
            if (!state.includes(action.payload)) {
                state.push(action.payload)
            }
        },
        delElem: (state, action) => {
            if (state.includes(action.payload)) {
               return state.filter(el => el !== action.payload)
            }
        },
        clearAll: (state) => {
            return []
        }
    }
})

export const { addElem, delElem, clearAll } = elementsModelListSlice.actions
export default elementsModelListSlice.reducer