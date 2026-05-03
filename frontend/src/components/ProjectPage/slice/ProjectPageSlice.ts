import { createSlice } from '@reduxjs/toolkit'
import type { IProject } from '../../CreateProjectForm/slices/projectSlice'

const initialState: IProject = {
    id: '',
    name: '',
    creationDate: null,
    autor: '',
    modelPath: '',
    versions: [],
}

const projectPage = createSlice({
    name: 'projectPage',
    initialState,
    reducers: {
        selectProject: (state, action) => {
            return action.payload
        }
    }
})

export const { selectProject } = projectPage.actions
export default projectPage.reducer