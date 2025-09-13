// src/store/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
    login as apiLogin,
    phoneLogin as apiPhoneLogin,
    facebookLogin as apiFacebookLogin,
    googleLogin as apiGoogleLogin,
    logout as apiLogout,
} from '@api/auth';
import { LoginRequest, LoginResponse, PhoneLoginRequest, PhoneLoginResponse } from '@types/auth';

interface UserState {
    currentUser: LoginResponse['user'] | PhoneLoginResponse['user'] | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: UserState = {
    currentUser: null,
    token: null,
    isLoading: false,
    error: null,
};

// --- Async Thunks ---
export const login = createAsyncThunk(
    'user/login',
    async (data: LoginRequest, { rejectWithValue }) => {
        try {
            const response = await apiLogin(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || error.message);
        }
    }
);

export const phoneLogin = createAsyncThunk(
    'user/phoneLogin',
    async (data: PhoneLoginRequest, { rejectWithValue }) => {
        try {
            const response = await apiPhoneLogin(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || error.message);
        }
    }
);

export const facebookLogin = createAsyncThunk(
    'user/facebookLogin',
    async (accessToken: string, { rejectWithValue }) => {
        try {
            const response = await apiFacebookLogin({ accessToken });
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || error.message);
        }
    }
);

export const googleLogin = createAsyncThunk(
    'user/googleLogin',
    async (accessToken: string, { rejectWithValue }) => {
        try {
            const response = await apiGoogleLogin({ accessToken });
            return response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || error.message);
        }
    }
);

export const logout = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
    try {
        await apiLogout();
    } catch (error: any) {
        return rejectWithValue(error?.response?.data || error.message);
    }
});

// --- Slice ---
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError(state) {
            state.error = null;
        },
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(login.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
            state.isLoading = false;
            state.currentUser = action.payload.user;
            state.token = action.payload.token;
        });
        builder.addCase(login.rejected, (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Phone Login
        builder.addCase(phoneLogin.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(
            phoneLogin.fulfilled,
            (state, action: PayloadAction<PhoneLoginResponse>) => {
                state.isLoading = false;
                state.currentUser = action.payload.user;
                state.token = action.payload.token;
            }
        );
        builder.addCase(phoneLogin.rejected, (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Facebook Login
        builder.addCase(facebookLogin.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(facebookLogin.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
            state.isLoading = false;
            state.currentUser = action.payload.user;
            state.token = action.payload.token;
        });
        builder.addCase(facebookLogin.rejected, (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Google Login
        builder.addCase(googleLogin.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(googleLogin.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
            state.isLoading = false;
            state.currentUser = action.payload.user;
            state.token = action.payload.token;
        });
        builder.addCase(googleLogin.rejected, (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.error = action.payload;
        });

        // Logout
        builder.addCase(logout.fulfilled, (state) => {
            state.currentUser = null;
            state.token = null;
            state.error = null;
        });
        builder.addCase(logout.rejected, (state, action: PayloadAction<any>) => {
            state.error = action.payload;
        });
    },
});

export const { clearError, setToken } = userSlice.actions;
export default userSlice.reducer;
