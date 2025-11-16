import { configureStore } from '@reduxjs/toolkit'
import  isOpenModalWindowSlice  from '../components/ModalWindow/slices/isOpenModalWindowSlice'
import authSlice from '../components/Auth/slices/authSlice'

export const store = configureStore({
    reducer: {
        isOpenModalWindowSlice,
        authSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch