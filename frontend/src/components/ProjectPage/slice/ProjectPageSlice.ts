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
        },
        updateVersions: (state, action) => {
            state.versions = action.payload
        }
    }
})

export const { selectProject, updateVersions } = projectPage.actions
export default projectPage.reducer