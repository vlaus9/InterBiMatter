import { configureStore } from '@reduxjs/toolkit'
import  isOpenModalWindowSlice  from '../components/ModalWindow/slices/isOpenModalWindowSlice'

export const store = configureStore({
    reducer: {
        isOpenModalWindowSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch