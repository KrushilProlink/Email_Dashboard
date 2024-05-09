/* eslint-disable react/prop-types */
import ClearIcon from "@mui/icons-material/Clear";
import { Autocomplete, DialogContentText, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from "@mui/material";
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
import { fetchContactData } from "../../redux/slice/contactSlice";
import { fetchTemplateData } from "../../redux/slice/emailTemplateSlice";
import { fetchLeadData } from "../../redux/slice/leadSlice";
import { apipost } from "../../service/api";

const Add = (props) => {
    const { open, handleClose, setUserAction } = props;
    // const [leadData, setLeadData] = useState([]);
    // const [contactData, setContactData] = useState([]);
    // const [emailTemplateData, setEmailTemplateData] = useState([]);
    const [messageType, setMessageType] = useState("template");
    const userid = localStorage.getItem('user_id');
    const userRole = localStorage.getItem("userRole");
    const dispatch = useDispatch();
    const leadData = useSelector((state) => state?.leadDetails?.data)
    const contactData = useSelector((state) => state?.contactDetails?.data)
    const emailTemplateData = useSelector((state) => state?.tempDetails?.data)

    // -----------  validationSchema
    const validationSchema = yup.object({
        relatedTo: yup.string().required("Related To is required"),
        subject: yup.string().required("Subject is required"),
        receiver: yup.string().required("Receiver is required"),
    });

    // -----------   initialValues
    const initialValues = {
        relatedTo: "Lead",
        subject: "",
        message: "",
        receiver: "",
        sender: userid,
        lead_id: "",
        contact_id: "",
        html: "",
        createdBy: userid,
    };

    // add email api
    const addEmail = async (values) => {
        const data = values;
        const result = await apipost('email/add', data)
        setUserAction(result)

        if (result && result.status === 201) {
            formik.resetForm();
            handleClose();
        }
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
            formik.resetForm();
            handleClose();
        }
    });

    // // lead api
    // const fetchLeadData = async () => {
    //     const result = await apiget(userRole === 'admin' ? `lead/list` : `lead/list/?createdBy=${userid}`)
    //     if (result && result.status === 200) {
    //         setLeadData(result?.data?.result)
    //     }
    // }

    // // contact api
    // const fetchContactData = async () => {
    //     const result = await apiget(userRole === 'admin' ? `contact/list` : `contact/list/?createdBy=${userid}`)
    //     if (result && result.status === 200) {
    //         setContactData(result?.data?.result)
    //     }
    // }

    // // emailtemplate api
    // const fetchEmailTemplatesData = async () => {
    //     const result = await apiget('emailtemplate/list')
    //     if (result && result.status === 200) {
    //         setEmailTemplateData(result?.data?.result)
    //     }
    // }

    useEffect(() => {
        formik.setFieldValue("lead_id", "");
        formik.setFieldValue("contact_id", "");
        formik.setFieldValue("receiver", "");
    }, [formik.values.relatedTo]);

    useEffect(() => {
        if (leadData?.length === 0 && contactData?.length === 0 && emailTemplateData === 0) {
            dispatch(fetchLeadData())
            dispatch(fetchContactData())
            dispatch(fetchTemplateData())
        }
    }, [])
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
                                <Grid item xs={12} sm={6} md={6}>
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
                                <Grid item xs={12} sm={6} md={6}>
                                    <FormControl>
                                        <FormLabel>Related To</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="relatedTo"
                                            value={formik.values.relatedTo}
                                            error={formik.touched.relatedTo && Boolean(formik.errors.relatedTo)}
                                            onChange={formik.handleChange}
                                        >
                                            <FormControlLabel value="Lead" control={<Radio />} label="Lead" />
                                            <FormControlLabel value="Contact" control={<Radio />} label="Contact" />
                                        </RadioGroup>
                                        <FormHelperText
                                            error={
                                                formik.touched.relatedTo && Boolean(formik.errors.relatedTo)
                                            }
                                        >
                                            {formik.touched.relatedTo && formik.errors.relatedTo}
                                        </FormHelperText>
                                    </FormControl>
                                </Grid>
                                {
                                    formik.values.relatedTo === "Lead" &&
                                    <Grid item xs={12} sm={12} md={12}>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Receiver (Lead)</FormLabel>
                                        <FormControl fullWidth>
                                            <Autocomplete
                                                id="lead-autocomplete"
                                                options={leadData}
                                                getOptionLabel={(lead) => `${lead.firstName} ${lead.lastName}`}
                                                value={leadData.find(lead => lead._id === formik.values.lead_id) || null}
                                                onChange={(event, newValue) => {
                                                    formik.setFieldValue("lead_id", newValue ? newValue?._id : "");
                                                    formik.setFieldValue("receiver", newValue ? newValue?.emailAddress : "");
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        size="small"
                                                        error={formik.touched.lead_id && Boolean(formik.errors.lead_id)}
                                                        helperText={formik.touched.lead_id && formik.errors.lead_id}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>
                                }
                                {
                                    formik.values.relatedTo === "Contact" &&
                                    <Grid item xs={12} sm={12} md={12}>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Receiver (Contact)</FormLabel>
                                        <FormControl fullWidth>
                                            <Autocomplete
                                                id="contact-autocomplete"
                                                options={contactData}
                                                getOptionLabel={(contact) => `${contact.firstName} ${contact.lastName}`}
                                                value={contactData.find(contact => contact._id === formik.values.contact_id) || null}
                                                onChange={(event, newValue) => {
                                                    formik.setFieldValue("contact_id", newValue ? newValue?._id : "");
                                                    formik.setFieldValue("receiver", newValue ? newValue?.emailAddress : "");
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        size="small"
                                                        error={formik.touched.contact_id && Boolean(formik.errors.contact_id)}
                                                        helperText={formik.touched.contact_id && formik.errors.contact_id}
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>
                                }
                                <Grid item xs={12} sm={12} md={12}>
                                    <FormLabel>Receiver</FormLabel>
                                    <TextField
                                        name='receiver'
                                        size='small'
                                        fullWidth
                                        disabled
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
                    <Button
                        type="submit"
                        variant="contained"
                        onClick={formik.handleSubmit}
                        style={{ textTransform: "capitalize" }}
                    // startIcon={<FiSave />}
                    >
                        Save
                    </Button>
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