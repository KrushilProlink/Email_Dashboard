import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiget } from 'src/service/api';

export const fetchContactData = createAsyncThunk('fetchContactData', async () => {
    const userid = localStorage.getItem('user_id');
    const userRole = localStorage.getItem("userRole");
    try {
        const response = await apiget(userRole === "admin" ? `contact/list` : `contact/list/?createdBy=${userid}`);
        return response?.data?.result;
    } catch (error) {
        throw error;
    }
});

const contactSlice = createSlice({
    name: 'contactDetails',
    initialState: {
        data: [],
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchContactData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchContactData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = "";
            })
            .addCase(fetchContactData.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            });
    },
});

export default contactSlice.reducer;