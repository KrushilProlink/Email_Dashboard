import { configureStore } from '@reduxjs/toolkit';
import emailSlice from '../slice/emailSlice';
import emailTemplateSlice from '../slice/emailTemplateSlice';
import userSlice from '../slice/userSlice';


export const store = configureStore({
    reducer: {
        userDetails: userSlice,
        tempDetails: emailTemplateSlice,
        emailDetails: emailSlice,
    },
});

