import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userSlice from '../slice/userSlice';
import leadSlice from '../slice/leadSlice';
import contactSlice from '../slice/contactSlice';
import emailTemplateSlice from '../slice/emailTemplateSlice';
import policySlice from '../slice/policySlice';
import taskSlice from '../slice/taskSlice';
import smsSlice from '../slice/smsSlice';
import meetingSlice from '../slice/meetingSlice';
import callSlice from '../slice/callSlice';
import emailSlice from '../slice/emailSlice';
import documentSlice from '../slice/documentSlice';
import calendarSlice from '../slice/calendarSlice';

const middleware = (getDefaultMiddleware) => {
    return getDefaultMiddleware({
        serializableCheck: false,
    });
};

const userPersistConfig = {
    key: 'userDetails',
    storage,
};
const leadPersistConfig = {
    key: 'leadDetails',
    storage,
};
const contactPersistConfig = {
    key: 'contactDetails',
    storage,
};
const emailTemPersistConfig = {
    key: 'tempDetails',
    storage,
};


export const store = configureStore({
    reducer: {
        userDetails: persistReducer(userPersistConfig, userSlice),
        leadDetails: persistReducer(leadPersistConfig, leadSlice),
        contactDetails: persistReducer(contactPersistConfig, contactSlice),
        tempDetails: persistReducer(emailTemPersistConfig, emailTemplateSlice),
        policyDetails: policySlice,
        taskDetails: taskSlice,
        smsDetails: smsSlice,
        meetingDetails: meetingSlice,
        callDetails: callSlice,
        emailDetails: emailSlice,
        documentDetails: documentSlice,
        calendarDetails: calendarSlice,
    },
    middleware,
});

export const persistor = persistStore(store);
