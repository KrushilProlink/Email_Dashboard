import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { FormLabel, Stack, TextField } from "@mui/material";
import * as yup from "yup";
import { useFormik } from "formik";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapSMSModel(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapSMSModel.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs(props) {
  const { open, onClose, sendSMS, ids } = props;

  const initialValues = {
    ids: [...ids],
    message: ""
  }

  const validationSchema = yup.object({
    message: yup.string().required("Message is required"),
  });

  // formik
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(values)
    },
  });

  const handleSubmit = (payload) => {
    sendSMS(payload)
  }

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <div>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapSMSModel
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Send SMS
        </BootstrapSMSModel>
        <DialogContent dividers>
          <FormLabel>Message</FormLabel>
          <TextField
            id="message"
            name="message"
            label=""
            size='medium'
            multiline
            rows={5}
            fullWidth
            onBlur={formik.handleBlur}
            value={formik.values.message}
            onChange={formik.handleChange}
            error={
              formik.touched.message &&
              Boolean(formik.errors.message)
            }
            helperText={
              formik.touched.message && formik.errors.message
            }
          />
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={formik.handleSubmit}>Send</Button>
            <Button variant="contained" color="error" onClick={handleClose}>Cancle</Button>
          </Stack>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
