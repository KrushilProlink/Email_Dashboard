/* eslint-disable no-useless-catch */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiget } from '../../service/api';

export const fetchLeadData = createAsyncThunk('fetchLeadData', async () => {
    const userid = localStorage.getItem('user_id');
    const userRole = localStorage.getItem("userRole");
    try {
        const response = await apiget(userRole === "admin" ? `lead/list` : `lead/list/?createdBy=${userid}`);
        return response?.data?.result;
    } catch (error) {
        throw error;
    }
});

const leadSlice = createSlice({
    name: 'leadDetails',
    initialState: {
        data: [],
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeadData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchLeadData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = "";
            })
            .addCase(fetchLeadData.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            });
    },
});

export default leadSlice.reducer;