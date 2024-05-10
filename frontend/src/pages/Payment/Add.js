/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import ClearIcon from "@mui/icons-material/Clear";
import { Autocomplete, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, InputAdornment, MenuItem, OutlinedInput, Radio, RadioGroup, Rating, Select, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as yup from "yup";
import { apiget, apipost } from '../../service/api';


const Add = (props) => {

    const { open, handleClose, _id, setUserAction } = props;

    const userdata = JSON.parse(localStorage.getItem('user'));

    // -----------  validationSchema
    const validationSchema = yup.object({
        firstName: yup.string().required("First Name is required"),
        lastName: yup.string().required("Last Name is required"),
        emailAddress: yup.string().email('Invalid email').required("Email is required"),
        phone: yup.string().matches(/^(0)?[0-9]{9,14}$/, 'Phone Number is invalid').required('Phone Number is required'),
        amount: yup.number().min(1, "Amount must be at least 1").required('Amount is required'),
    });

    // -----------   initialValues
    const initialValues = {
        firstName: userdata?.firstName,
        lastName: userdata?.lastName,
        emailAddress: userdata?.emailAddress,
        phone: "",       // senderPhoneNumber
        amount: "",
    };

    const makePaymentRequest = async (values) => {    // initiateSTKPush
        const data = values;
        const result = await apipost('payment/stkPush', data)
        // setUserAction(result);

        if (result && result.status === 200) {
            formik.resetForm();
            handleClose();
        } else {
            toast.error(`${result?.response?.data?.message}`)
        }
    }

    // formik
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            makePaymentRequest(values);
        },
    });

    return (
        <div>
            <Dialog
                open={open}
                onClose={() => {
                    formik.resetForm();
                    handleClose();
                }}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            // TransitionComponent={Transition}
            >
                <DialogTitle
                    id="scroll-dialog-title"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        // backgroundColor: "#2b4054",
                        // color: "white",
                    }}
                >
                    <Typography variant="h6">Make Payment</Typography>
                    <Typography>
                        <ClearIcon
                            onClick={handleClose}
                            style={{ cursor: "pointer" }}
                        />
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <form>
                        <DialogContentText
                            id="scroll-dialog-description"
                            tabIndex={-1}
                        >
                            <Grid
                                container
                                rowSpacing={3}
                                columnSpacing={{ xs: 0, sm: 5, md: 4 }}
                            >
                                {/* <Grid item xs={12} sm={4} md={4}> */}
                                <Grid item xs={6}>
                                    <FormLabel>First Name</FormLabel>
                                    <TextField
                                        id="fristName"
                                        name="firstName"
                                        label=""
                                        size='small'
                                        maxRows={10}
                                        fullWidth
                                        disabled
                                        value={formik.values.firstName}
                                        onChange={formik.handleChange}
                                        error={
                                            formik.touched.firstName &&
                                            Boolean(formik.errors.firstName)
                                        }
                                        helperText={
                                            formik.touched.firstName && formik.errors.firstName
                                        }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormLabel>Last Name</FormLabel>
                                    <TextField
                                        id="lastName"
                                        name="lastName"
                                        label=""
                                        size='small'
                                        fullWidth
                                        disabled
                                        value={formik.values.lastName}
                                        onChange={formik.handleChange}
                                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                        helperText={formik.touched.lastName && formik.errors.lastName}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormLabel>Email</FormLabel>
                                    <TextField
                                        id="emailAddress"
                                        name="emailAddress"
                                        label=""
                                        size='small'
                                        fullWidth
                                        disabled
                                        value={formik.values.emailAddress}
                                        onChange={formik.handleChange}
                                        error={
                                            formik.touched.emailAddress &&
                                            Boolean(formik.errors.emailAddress)
                                        }
                                        helperText={
                                            formik.touched.emailAddress && formik.errors.emailAddress
                                        }
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormLabel>Amount</FormLabel>
                                    <TextField
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        size='small'
                                        fullWidth
                                        inputProps={{ min: 1 }}
                                        value={formik.values.amount}
                                        onChange={formik.handleChange}
                                        error={
                                            formik.touched.amount &&
                                            Boolean(formik.errors.amount)
                                        }
                                        helperText={
                                            formik.touched.amount && formik.errors.amount
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormLabel>Phone Number</FormLabel>
                                    <TextField
                                        id="phone"
                                        name="phone"
                                        size='small'
                                        fullWidth
                                        value={formik.values.phone}
                                        onChange={formik.handleChange}
                                        error={
                                            formik.touched.phone &&
                                            Boolean(formik.errors.phone)
                                        }
                                        helperText={
                                            formik.touched.phone && formik.errors.phone
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </DialogContentText>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={formik.handleSubmit} variant='contained' color='primary'>Make Payment</Button>
                    <Button onClick={() => {
                        formik.resetForm()
                        handleClose()
                    }} variant='outlined' color='error'>Cancle</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Add