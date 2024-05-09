/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import { useFormik } from "formik";
import * as yup from "yup";
import { FormLabel, Select, FormControl, MenuItem, FormHelperText, Checkbox, ListItemText } from "@mui/material";
import { apipost, apiget } from "../../service/api";
import { useSelector } from "react-redux";

const Add = (props) => {
    const { open, handleClose, setUserAction } = props;
    const userid = localStorage.getItem('user_id');
    const userRole = localStorage.getItem("userRole");
    const userDetails = useSelector((state) => state?.userDetails?.data)


    // -----------  validationSchema
    const validationSchema = yup.object({
        file: yup.string().required("File is required"),
        fileName: yup.string().required("File Name is required"),
    });

    // -----------   initialValues
    const initialValues = {
        file: "",
        fileName: "",
        assignTo: [],
        createdBy: userid
    };

    // add contact api
    const fileUpload = async (values) => {
        const data = new FormData()
        data.append("name", values.file.name)
        data.append("file", values.file)
        data.append("fileName", values.fileName)
        data.append("createdBy", values.createdBy)
        values.assignTo.forEach((userId) => {
            data.append("assignTo[]", userId);
        });

        const result = await apipost('document/upload', data)
        setUserAction(result)

        if (result && result.status === 200) {
            formik.resetForm();
            handleClose();
            // toast.success(result.data.message)
        }
    }

    // formik
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            fileUpload(values)
        },
    });


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
                    }}
                >
                    <Typography variant="h6">Add New</Typography>
                    <Typography>
                        <ClearIcon
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                handleClose();
                                formik.resetForm();
                            }}
                        />
                    </Typography>
                </DialogTitle>

                <DialogContent dividers>
                    <form encType="multipart/form-data">
                        <Grid
                            container
                            rowSpacing={3}
                            columnSpacing={{ xs: 0, sm: 5, md: 4 }}
                        >
                            <Grid item xs={12} sm={12} md={12}>
                                <FormLabel>Upload File</FormLabel>
                                <TextField
                                    id="file"
                                    name="file"
                                    size="small"
                                    maxRows={10}
                                    fullWidth
                                    type="file"
                                    multiple
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(event) => {
                                        formik.setFieldValue("file", event.currentTarget.files[0]);
                                    }}
                                    error={
                                        formik.touched.file &&
                                        Boolean(formik.errors.file)
                                    }
                                    helperText={
                                        formik.touched.file && formik.errors.file
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <FormLabel>FileName</FormLabel>
                                <TextField
                                    id="fileName"
                                    name="fileName"
                                    size="small"
                                    fullWidth
                                    value={formik.values.fileName}
                                    onChange={formik.handleChange}
                                    error={
                                        formik.touched.fileName && Boolean(formik.errors.fileName)
                                    }
                                    helperText={formik.touched.fileName && formik.errors.fileName}
                                />
                            </Grid>
                            {userRole !== "user" && <Grid item xs={12} sm={12} md={12}>
                                <FormControl fullWidth>
                                    <FormLabel>Assign To</FormLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="assignTo"
                                        name="assignTo"
                                        size="small"
                                        multiple
                                        value={formik.values.assignTo}
                                        onChange={formik.handleChange}
                                        error={formik.touched.assignTo && Boolean(formik.errors.assignTo)}
                                        renderValue={(selected) => (
                                            <div>
                                                {
                                                    selected.map((value) => {
                                                        const userData = userDetails?.find((user) => user._id === value)
                                                        return (
                                                            <div key={value}>
                                                                {`${userData?.firstName} ${userData?.lastName}`}
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                        }
                                    >
                                        {
                                            userDetails?.map((user) => (
                                                <MenuItem value={user?._id}>
                                                    <Checkbox checked={formik.values.assignTo.indexOf(user?._id) > -1} />
                                                    <ListItemText primary={`${user?.firstName} ${user?.lastName}`} />
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                    <FormHelperText
                                        error={
                                            formik.touched.assignTo && Boolean(formik.errors.assignTo)
                                        }
                                    >
                                        {formik.touched.assignTo && formik.errors.assignTo}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>}
                        </Grid>
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