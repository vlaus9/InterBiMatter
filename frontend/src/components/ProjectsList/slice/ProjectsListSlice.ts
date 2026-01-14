import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { IProject } from "../../CreateProjectForm/slices/projectSlice"
import axios from "axios"

interface IProjectsList {
    projects: IProject[] | null
    loading: boolean
    error: string | null
}

interface IProjectsListResponse {
    status: 'success' | 'error'
    data: {
        projects: IProject[]
    }
    message?: string
}

const initialState: IProjectsList = {
    projects: null,
    loading: false,
    error: null
}

export const getProjectsAll = createAsyncThunk(
    'project/getProjectsAll',
    async(user: string, { rejectWithValue }) => {
        try {
            const projects = await axios.get<IProjectsListResponse>(
                `http://localhost:80/api/project/getProjectsAll`,
                { params: { user }}
            )
            return projects.data
        }
        catch (error: any) {
            const errorMessage = error.response.data.message
            || error.message
            || 'Ошибка получения списка проектов'

            return rejectWithValue(errorMessage)
        }
    }
)

const projectList = createSlice({ 
    name: 'projectList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProjectsAll.pending, (state) => {
                state.loading = true,
                state.error = null
            })
            .addCase(getProjectsAll.fulfilled, (state, action: PayloadAction<IProjectsListResponse>) => {
                state.projects = action.payload.data.projects,
                state.loading = false,
                state.error = null
            })
            .addCase(getProjectsAll.rejected, (state, action) => {
                state.loading = false,
                state.error = action.payload as string
            })
    }
})


export default projectList.reducer