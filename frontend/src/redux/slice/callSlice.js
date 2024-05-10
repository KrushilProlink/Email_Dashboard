/* eslint-disable no-useless-catch */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiget } from '../../service/api';

export const fetchCallData = createAsyncThunk('fetchCallData', async () => {
    const userid = localStorage.getItem('user_id');
    const userRole = localStorage.getItem("userRole");
    try {
        const response = await apiget(userRole === "admin" ? `call/list` : `call/list/?createdBy=${userid}`);
        return response?.data?.result;
    } catch (error) {
        throw error;
    }
});

const callSlice = createSlice({
    name: 'callDetails',
    initialState: {
        data: [],
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCallData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchCallData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = "";
            })
            .addCase(fetchCallData.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            });
    },
});

export default callSlice.reducer;