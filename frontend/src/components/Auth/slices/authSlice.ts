import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'

export interface IUser {
    id: string,
    email: string,
    password: string
}

interface IAuthResponse {
    success: boolean,
    token: string,
    user: IUser
}

interface IAuthState {
    user: IUser | null,
    token: string | null,
    loading: boolean,
    error: string | null
}

const initialState: IAuthState = {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
}

export const registerUser = createAsyncThunk(
    'auth/register',
    async(userData: { email: string, password: string, name: string}, { rejectWithValue }) => {
        try {
            const responce = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })

            const data: IAuthResponse & { message?: string } = await responce.json()

            if (!responce.ok) {
                return rejectWithValue(data.message || 'Registration failed') 
            }

            return data
        } catch (error: any) { 
            return rejectWithValue(error.message || 'Network error')
        }
    }
)

export const loginUser = createAsyncThunk(
    'auth/login',
    async(credentials: { email: string, password: string}, { rejectWithValue }) => {
        try {
            const responce = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(credentials)
            })

            const data: IAuthResponse & { message: string } = await responce.json()

            if (!responce.ok) {
                return rejectWithValue(data.message || 'Login failed')
            }
            return data
        } catch (error: any) {
            return rejectWithValue(error.message || 'Network error')
        }
         
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut: (state) => {
            state.user = null,
            state.token = null,
            localStorage.removeItem('token'),
            state.error = null
        },
        cleanError: (state) => {
            state.error = null
        },
        setUser: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload
        }
    },
    extraReducers: (bulider) => {
        bulider
            .addCase(registerUser.pending, (state) => {
                state.loading = true,
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<IAuthResponse>) => {
                state.loading = false,
                state.user = action.payload.user,
                state.token = action.payload.token,
                localStorage.setItem('token', action.payload.token),
                state.error = null
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false,
                state.error = action.payload as string
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true,
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<IAuthResponse>) => {
                state.loading = false,
                state.user = action.payload.user,
                state.token = action.payload.token,
                localStorage.setItem('token', action.payload.token),
                state.error = null
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false,
                state.error = action.payload as string
            })
    }
})

export const { logOut, cleanError, setUser } = authSlice.actions

export default authSlice.reducer