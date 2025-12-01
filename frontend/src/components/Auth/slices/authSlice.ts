import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'

export interface IUser {
    id: string,
    email: string,
    password: string,
    name: string
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
    isAuth: boolean
}

const initialState: IAuthState = {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
    isAuth: false
}


export const registerUser = createAsyncThunk(
    'auth/register',
    async(userData: { email: string; password: string; name: string }, { rejectWithValue }) => {
        try {
            const responce = await fetch(`http://localhost:80/api/auth/register`, {
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
            const responce = await fetch(`http://localhost:80/api/auth/login`, {
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
            localStorage.removeItem('tokenExpiration'),
            localStorage.removeItem('user'),
            state.error = null,
            state.isAuth = false
        },
        cleanError: (state) => {
            state.error = null
        },
        setUser: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload
        },
        checkAuth: (state) => {
            const token = localStorage.getItem('token');
            const expirationTime = localStorage.getItem('tokenExpiration')

            if (token && expirationTime) { 
                const isExpired = Date.now() > parseInt(expirationTime)

                if(!isExpired) {
                    state.token = token;
                    state.isAuth = true;

                    const userData = localStorage.getItem('user');
                    if (userData) {
                        state.user = JSON.parse(userData)
                    }
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('tokenExpiration');
                    localStorage.removeItem('user');
                    state.token = null;
                    state.isAuth = false;
                    state.user = null
                }
            } else {
                state.token = null;
                state.isAuth = false;
                state.user = null
            }
        }
    },
    extraReducers: (bulider) => {
        bulider
            .addCase(registerUser.pending, (state) => {
                state.loading = true,
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<IAuthResponse>) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;

                const expiresIn = 8 * 60 * 60 * 1000;
                const expirationTime = Date.now() + expiresIn;

                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('tokenExpiration', expirationTime.toString());
                localStorage.setItem('user',JSON.stringify(action.payload.user));

                state.error = null;
                state.user.name = action.payload.user.name;
                state.isAuth = true
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
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;

                const expiresIn = 8 * 60 * 60 * 1000;
                const expirationTime = Date.now() + expiresIn;

                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('tokenExpiration', expirationTime.toString());
                localStorage.setItem('user',JSON.stringify(action.payload.user));

                state.error = null;
                state.isAuth = true
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false,
                state.error = action.payload as string
            })
    }
})

export const { logOut, cleanError, setUser, checkAuth } = authSlice.actions

export default authSlice.reducer