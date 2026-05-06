import { createAsyncThunk } from '@reduxjs/toolkit'
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