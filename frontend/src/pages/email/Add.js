/* eslint-disable react/prop-types */
import ClearIcon from "@mui/icons-material/Clear";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, CircularProgress, DialogContentText, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { fetchTemplateData } from "../../redux/slice/emailTemplateSlice";
import { apipost } from "../../service/api";

const Add = (props) => {
    const { open, handleClose, setUserAction } = props;
    const [isLoading, setIsLoading] = useState(false);

    const [messageType, setMessageType] = useState("template");
    const userid = localStorage.getItem('user_id');
    const userRole = localStorage.getItem("userRole");
    const dispatch = useDispatch();
    const emailTemplateData = useSelector((state) => state?.tempDetails?.data)

    // -----------  validationSchema
    const validationSchema = yup.object({
        subject: yup.string().required("Subject is required"),
        receiver: yup.string().required("Receiver is required"),
    });

    // -----------   initialValues
    const initialValues = {
        subject: "",
        message: "",
        receiver: "",
        sender: userid,
        html: "",
        createdBy: userid,
    };

    // add email api
    const addEmail = async (values) => {
        setIsLoading(true)

        try {
            const data = values;
            const result = await apipost('email/add', data)
            setUserAction(result)

            if (result && result.status === 201) {
                formik.resetForm();
                handleClose();
            }

        } catch (error) {
            console.log(error);
        }
        setIsLoading(false)

    };

    const handleMessageTypeChange = (e) => {
        setMessageType(e.target.value);
        formik.setFieldValue('message', '');
        formik.setFieldValue('html', '');
    };

    // formik
    const formik = useFormik({
        initialValues,
        validationSchema,
        validate: (values) => {
            const errors = {};
            if (messageType === 'own' && !values.message) {
                errors.message = 'Message is required';
            } else if (messageType === 'template' && !values.html) {
                errors.html = 'Template is required';
            }
            return errors;
        },
        onSubmit: async (values) => {
            addEmail(values);
        }
    });


    useEffect(() => {
        if (emailTemplateData?.length === 0) {
            dispatch(fetchTemplateData())
        }
    }, [open])

    return (
        <div>
            <Dialog
                open={open}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
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
                    <Typography variant="h6">Add New </Typography>
                    <Typography>
                        <ClearIcon
                            onClick={() => {
                                formik.resetForm()
                                handleClose()
                            }}
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
                                <Grid item xs={12} sm={12} md={12}>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Subject</FormLabel>
                                    <TextField
                                        id="subject"
                                        name="subject"
                                        label=""
                                        fullWidth
                                        size="small"
                                        value={formik.values.subject}
                                        onChange={formik.handleChange}
                                        error={
                                            formik.touched.subject &&
                                            Boolean(formik.errors.subject)
                                        }
                                        helperText={
                                            formik.touched.subject && formik.errors.subject
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <FormLabel>Receiver</FormLabel>
                                    <TextField
                                        name='receiver'
                                        size='small'
                                        fullWidth
                                        value={formik.values.receiver}
                                        onChange={formik.handleChange}
                                        error={formik.touched.receiver && Boolean(formik.errors.receiver)}
                                        helperText={formik.touched.receiver && formik.errors.receiver}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <FormLabel>Message</FormLabel>
                                    <RadioGroup
                                        row
                                        name="messageType"
                                        value={messageType}
                                        onChange={handleMessageTypeChange}
                                    >
                                        <FormControlLabel value="template" control={<Radio />} label="Template" />
                                        <FormControlLabel value="own" control={<Radio />} label="Own" />
                                    </RadioGroup>
                                </Grid>
                                {messageType === 'template' && (
                                    <Grid item xs={12} sm={12} md={12}>
                                        <FormControl fullWidth>
                                            {/* <FormLabel>Template Message</FormLabel> */}
                                            <Select
                                                fullWidth
                                                size="small"
                                                id="html"
                                                name="html"
                                                value={formik.values.html}
                                                onChange={(e) => formik.setFieldValue('html', e.target.value)}
                                                error={formik.touched.html && Boolean(formik.errors.html)}
                                            >
                                                {emailTemplateData?.map(template => (
                                                    <MenuItem key={template._id} value={template.html}>{template.name}</MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText
                                                error={
                                                    formik.touched.html && Boolean(formik.errors.html)
                                                }
                                            >
                                                {formik.touched.html && formik.errors.html}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>
                                )}
                                {messageType === 'own' && (
                                    <Grid item xs={12} sm={12} md={12}>
                                        {/* <FormLabel>Message</FormLabel> */}
                                        <ReactQuill
                                            name="message"
                                            value={formik.values.message}
                                            onChange={(value) => formik.setFieldValue('message', value)}
                                            disabled={messageType === 'template'}
                                        />
                                        <FormHelperText error={formik.touched.message && Boolean(formik.errors.message)}>
                                            {formik.touched.message && formik.errors.message}
                                        </FormHelperText>
                                    </Grid>
                                )}

                            </Grid>
                        </DialogContentText>
                    </form>
                </DialogContent>

                <DialogActions>
                    <LoadingButton onClick={formik.handleSubmit} variant='contained' color='primary' disabled={!!isLoading}>
                        {isLoading ? <CircularProgress size={27} /> : 'Save'}
                    </LoadingButton>
                    <Button
                        type="reset"
                        variant="outlined"
                        style={{ textTransform: "capitalize" }}
                        color="error"
                        onClick={() => {
                            formik.resetForm()
                            handleClose()
                        }}
                    >
                        Cancle
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Add