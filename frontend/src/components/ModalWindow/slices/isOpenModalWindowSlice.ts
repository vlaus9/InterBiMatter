import { createSlice } from '@reduxjs/toolkit'
import type { IModalWindow } from '../types/ModalWindowTypes'

const initialState: IModalWindow = {
    id: null,
    name: null,
    contenType: null,
    contentData: null,
    isOpen: false
}

const isOpenModalWindowSlice = createSlice({
    name: 'isOpenModalWindowSlice',
    initialState,
    reducers:{
        isOpen: (state, action) => {
            state.id = action.payload.id
            state.name = action.payload.name
            state.contenType = action.payload.contenType
            state.contentData = action.payload.contentData
            state.isOpen = action.payload.isOpen
        },
        isClosed: (state) => {
            state.id = initialState.id
            state.name = initialState.name
            state.contenType = initialState.contenType
            state.contentData = initialState.contentData
            state.isOpen = initialState.isOpen
        },
    }
})

export const { isOpen, isClosed } = isOpenModalWindowSlice.actions
export default isOpenModalWindowSlice.reducer