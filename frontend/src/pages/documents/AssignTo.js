/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ClearIcon from "@mui/icons-material/Clear";
import { useFormik } from "formik";
import { FormLabel, Select, FormControl, MenuItem, FormHelperText, Checkbox, ListItemText } from "@mui/material";
import { apiget, apiput } from "../../service/api";
import { useSelector } from "react-redux";

const AssignTo = (props) => {
    const { open, handleClose, documentId } = props;
    const userid = localStorage.getItem('user_id');

    const userDetails = useSelector((state) => state?.userDetails?.data)

    // -----------   initialValues
    const initialValues = {
        assignTo: [],
        createdBy: userid
    };

    const assignDocumentsToUsers = async (values) => {
        const data = {
            assignTo: values?.assignTo,
            documentId
        };

        const result = await apiput('document/assign', data);

        if (result && result.status === 200) {
            formik.resetForm();
            handleClose();
        }
    }

    // formik
    const formik = useFormik({
        initialValues,
        enableReinitialize: true,
        onSubmit: async (values) => {
            assignDocumentsToUsers(values)
        },
    });

    const fetchDocumentdata = async () => {
        const result = await apiget(`document/list/?_id=${documentId}`);
        if (result && result.status === 200) {
            formik.setFieldValue("assignTo", result?.data?.result[0]?.assignTo);
        }
    }

    useEffect(() => {
        if (documentId) {
            fetchDocumentdata();
        }
    }, [open, documentId]);

    return (
        <div>
            <Dialog
                fullWidth
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
                    <Typography variant="h6">Assign To User </Typography>
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
                                                        const userData = userDetails.find((user) => user._id === value)
                                                        return (
                                                            <div key={value}>
                                                                {`${userData?.firstName} ${userData?.lastName}`}
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )}
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
                            </Grid>
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

export default AssignTo;