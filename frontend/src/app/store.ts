import { configureStore } from '@reduxjs/toolkit'
import  isOpenModalWindowSlice  from '../components/ModalWindow/slices/isOpenModalWindowSlice'
import authSlice from '../components/Auth/slices/authSlice'
import projectList from '../components/ProjectList/ProjectListSlice'
import projectSlice from '../components/CreateProjectForm/slices/projectSlice'

export const store = configureStore({
    reducer: {
        isOpenModalWindowSlice,
        authSlice,
        projectList,
        projectSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch