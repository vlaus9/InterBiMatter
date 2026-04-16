import { createSlice } from "@reduxjs/toolkit";

interface IElementsModelList {
    selectedElem: number[],
    isMakeInvisible: boolean,
    isWireFrame: boolean
}

const initialState: IElementsModelList = {
    selectedElem: [],
    isMakeInvisible: false,
    isWireFrame: false
}

const elementsModelListSlice = createSlice({
    name: 'elementModelListSlice',
    initialState,
    reducers: {
        addElem: (state, action) => {
            if (!state.selectedElem.includes(action.payload)) {
                state.selectedElem.push(action.payload)
            }
        },
        delElem: (state, action) => {
            if (state.selectedElem.includes(action.payload)) {
               state.selectedElem = state.selectedElem.filter(el => el !== action.payload)
            }
        },
        clearAll: (state) => {
            state.selectedElem = []
        },
        invisible: (state) => {
            state.isMakeInvisible = true
        },
        visible: (state) => {
            state.isMakeInvisible = false
        },
        makeWireFrame: (state) => {
            state.isWireFrame = true
        },
        delWireFrame: (state) => {
            state.isWireFrame = false
        }
    }
})

export const { addElem, delElem, clearAll, invisible, visible, makeWireFrame, delWireFrame } = elementsModelListSlice.actions
export default elementsModelListSlice.reducer