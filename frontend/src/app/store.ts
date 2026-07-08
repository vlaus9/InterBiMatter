import { configureStore } from '@reduxjs/toolkit'
import  isOpenModalWindowSlice  from '../components/ModalWindow/slices/isOpenModalWindowSlice'
import authSlice from '../components/Auth/slices/authSlice'
import projectList from '../components/ProjectsList/slice/ProjectsListSlice'
import projectSlice from '../components/CreateProjectForm/slices/projectSlice'
import elementsModelListSlice from '../components/Model/slice/elementsModelListSlice'
import projectPage from '../components/ProjectPage/slice/ProjectPageSlice'
import selectPropertiesSlice from '../components/Model/ModelPropertiesTableBMT/slices/selectPropertiesSlice'

export const store = configureStore({
    reducer: {
        isOpenModalWindowSlice,
        authSlice,
        projectList,
        projectSlice,
        elementsModelListSlice,
        projectPage,
        selectPropertiesSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch