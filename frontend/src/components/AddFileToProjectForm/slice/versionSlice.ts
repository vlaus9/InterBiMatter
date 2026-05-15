import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface IVersions {
    id: string
    name: string
    description?: string
    date: Date | string
    filePath: string
}

interface IVersionsResponse {
    status: 'success'| 'error'
    data: {
        versions: IVersions
    }
    message?: string
}

interface IVersionState {
    version: IVersions | null
    loading: boolean,
    error: string | null
    isActive: boolean
}

const initialState: IVersionState = {
    version: null,
    loading: false,
    error: null,
    isActive: false
}

export const addVersionToProject = createAsyncThunk(
    'project/addVersion',
    async(formData: FormData, {rejectWithValue}) => {
        try {
            const projectId = formData.get('projectId')
            const response = await axios.post<{
                status: string
                data: { versions: IVersions[] } 
            }>(
                `http://localhost:80/api/project/addFileToProject/${projectId}`,
                formData,
                {
                    headers: {
                        'Content-type': 'multipart/form-data'
                    }
                }
            )
            return response.data.data.versions
        } catch (error: any) {
            const errorMessage = error.response.data.message
            || error.message
            || "ошибка добавления файла в проект"

            return rejectWithValue(errorMessage)
        }
    }
)

const versionSlice = createSlice({
    name: 'version',
    initialState,
    reducers: {
        cleanError: (state) => {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addVersionToProject.pending, (state) => {
                state.loading = true;
                state.error = null
            })
            .addCase(addVersionToProject.fulfilled, (state, action: PayloadAction<IVersions>) => {
                state.loading = false;
                state.isActive = true;
                state.version = action.payload;
                state.error = null
            })
            .addCase(addVersionToProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })
    }
})

export const { cleanError } = versionSlice.actions
export default versionSlice.reducer