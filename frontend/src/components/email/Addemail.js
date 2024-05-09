/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import { useFormik } from "formik";
import * as yup from "yup";
// eslint-disable-next-line import/no-unresolved
import { apipost, apiget } from "src/service/api";
import { toast } from "react-toastify";
import { FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup, FormControl, Select, MenuItem, } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchTemplateData } from "../../redux/slice/emailTemplateSlice";

const Addemail = (props) => {
    const { open, handleClose, _id, setUserAction, receiver, module } = props
    const dispatch = useDispatch()
    const [messageType, setMessageType] = useState("template");
    // const [emailTemplateData, setEmailTemplateData] = useState([]);
    const emailTemplateData = useSelector((state) => state?.tempDetails?.data)

    const user = JSON.parse(localStorage.getItem('user'))

    // -----------  validationSchema
    const validationSchema = yup.object({
        subject: yup.string().required("Subject is required"),
        receiver: yup.string().email().required("Receiver is required"),
    });

    // -----------   initialValues
    const initialValues = {
        sender: user?._id,
        subject: "",
        receiver: receiver?.emailAddress,
        message: "",
        lead_id: module === "Lead" ? _id : "",
        contact_id: module === "Contact" ? _id : "",
        createdBy: user?._id,
        html: "",
    };

    // add email api
    const addEmail = async (values) => {
        const data = values;
        const result = await apipost('email/add', data)
        setUserAction(result)

        if (result && result.status === 201) {
            handleClose();
            formik.resetForm();
            // toast.success(result.data.message)
        }
    }
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
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            addEmail(values);
            resetForm();
        },
    });

    const handleMessageTypeChange = (e) => {
        setMessageType(e.target.value);
        formik.setFieldValue('message', '');
        formik.setFieldValue('html', '');
    };

    // // emailtemplate api
    // const fetchEmailTemplatesData = async () => {
    //     const result = await apiget('emailtemplate/list')
    //     if (result && result.status === 200) {
    //         setEmailTemplateData(result?.data?.result)
    //     }
    // }

    useEffect(() => {
        if (emailTemplateData === 0) {
            dispatch(fetchTemplateData())
        }
    }, []);

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
                    <Typography variant="h6">Email </Typography>
                    <Typography>
                        <ClearIcon
                            onClick={() => {
                                formik.resetForm();
                                handleClose();
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
                                <Grid item xs={12} sm={12}>
                                    <FormLabel>Receiver</FormLabel>
                                    <TextField
                                        id="receiver"
                                        name="receiver"
                                        size="small"
                                        fullWidth
                                        disabled
                                        value={formik.values.receiver}
                                        onChange={formik.handleChange}
                                        error={
                                            formik.touched.receiver &&
                                            Boolean(formik.errors.receiver)
                                        }
                                        helperText={
                                            formik.touched.receiver && formik.errors.receiver
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <FormLabel>Subject</FormLabel>
                                    <TextField
                                        id="subject"
                                        name="subject"
                                        size="small"
                                        fullWidth
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
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={formik.handleSubmit}
                        style={{ textTransform: "capitalize" }}
                        color="secondary"
                    >
                        Save
                    </Button>
                    <Button
                        type="reset"
                        variant="outlined"
                        style={{ textTransform: "capitalize" }}
                        onClick={() => {
                            formik.resetForm()
                            handleClose()
                        }}
                        color="error"
                    >
                        Cancle
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Addemail