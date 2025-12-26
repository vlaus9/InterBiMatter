import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

interface IProject {
    id: number | null
    name: string
    creationDate: Date | null
    autor: string
    modelPath: string
}

interface IProjectState {
    project: IProject | null
    loading: boolean
    error: string | null
    isActive: boolean
}

interface IProjectResponse {
    status: 'success' | 'error'
    data: { 
        project: IProject 
    }
message?: string
}

const initialState: IProjectState = {
    project: null,
    loading: false,
    error: null,
    isActive: false
}

export const createProject = createAsyncThunk(
    'project/createProject',
    async(credentials: { name: string, autor: string, modelPath: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post<IProject>(
                `http://localhost:80/api/project/createProject`, 
                credentials, 
                { 
                    headers: { 
                        'Content-type': 'multipart/form-data'
                    }
                }
            )

            return response.data
        } catch (error: any) {
            const errorMessage = error.response.data.message
                || error.message
                || 'Ошибка создания проекта'
            
            return rejectWithValue(errorMessage)
        }
    } 
)

export const openProject = createAsyncThunk(
    'project/getProject',
    async(projectId: string, { rejectWithValue }) => {
        try {
            const project = await axios.get<IProjectResponse>(
                `http://localhost:80/api/project/getProject/${projectId}`,
            )

            return project.data
        } catch (error: any) {
            const errorMessage = error.response.data.message
             || error.message
             || 'Ошибка получения данных проекта'

             return rejectWithValue(errorMessage)
        }
    }
)

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        closeProject: (state) => {
            state.project = null;
            localStorage.removeItem('project');
            state.loading = false;
            state.error = null;
            state.isActive = false
        },
        cleanError: (state) => {
            state.error = null
        },
        checkProject: (state) => {
            const project = localStorage.getItem('project');

            if(!project) {
                state.project = null;
                state.isActive = false
            } else {
                state.project = JSON.parse(project);
                state.isActive = true
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProject.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(createProject.fulfilled, (state, action: PayloadAction<IProject>) => {
                state.loading = false;
                state.isActive = true;
                state.project = action.payload;
                state.error = null
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })
            .addCase(openProject.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(openProject.fulfilled, (state, action: PayloadAction<IProjectResponse>) => {
                state.loading = false;
                state.project = action.payload.data.project
                state.isActive = true;
                state.error = null
            })
            .addCase(openProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })
    }
}
)

export const { closeProject, cleanError, checkProject } = projectSlice.actions

export default projectSlice.reducer