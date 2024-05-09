import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiget } from 'src/service/api';

export const fetchTemplateData = createAsyncThunk('fetchTemplateData', async () => {
    const userid = localStorage.getItem('user_id');
    const userRole = localStorage.getItem("userRole");
    try {
        const response = await apiget(userRole === "admin" ? `emailtemplate/list` : `emailtemplate/list/?createdBy=${userid}`);
        return response?.data?.result;
    } catch (error) {
        throw error;
    }
});

const emailTemplateSlice = createSlice({
    name: 'templateDetails',
    initialState: {
        data: [],
        isLoading: false,
        error: "",
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTemplateData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchTemplateData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = "";
            })
            .addCase(fetchTemplateData.rejected, (state, action) => {
                state.isLoading = false;
                state.data = [];
                state.error = action.error.message;
            });
    },
});

export default emailTemplateSlice.reducer;