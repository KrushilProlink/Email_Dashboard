import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiget } from '../../service/api';

export const fetchUserData = createAsyncThunk('fetchUserData', async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await apiget("user/list");
        return response?.data?.result;
    } catch (error) {
        throw error;
    }
});

const userSlice = createSlice({
    name: 'userDetails',
    initialState: {
        data: [],
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = "";
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            });
    },
});

export default userSlice.reducer;