/* eslint-disable no-useless-catch */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiget } from '../../service/api';

export const fetchMeetingData = createAsyncThunk('fetchMeetingData', async () => {
    const userid = localStorage.getItem('user_id');
    const userRole = localStorage.getItem("userRole");
    try {
        const response = await apiget(userRole === "admin" ? `meeting/list` : `meeting/list/?createdBy=${userid}`);
        return response?.data?.result;
    } catch (error) {
        throw error;
    }
});

const meetingSlice = createSlice({
    name: 'meetingDetails',
    initialState: {
        data: [],
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMeetingData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchMeetingData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = "";
            })
            .addCase(fetchMeetingData.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            });
    },
});

export default meetingSlice.reducer;