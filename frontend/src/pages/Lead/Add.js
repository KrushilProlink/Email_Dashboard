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
import { policyTypeList } from '../../_mock/data';
import Palette from '../../theme/palette';

const Add = (props) => {

  const { open, handleClose, _id, setUserAction } = props
  const [user, setUser] = useState([])

  const userid = localStorage.getItem('user_id');
  const userdata = JSON.parse(localStorage.getItem('user'));

  // -----------  validationSchema
  const validationSchema = yup.object({
    title: yup.string().required("Title is required"),
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    dateOfBirth: yup.date().required("Date of Birth is required"),
    gender: yup.string().required("Gender is required"),
    phoneNumber: yup.string().matches(/^(0)?[0-9]{9,14}$/, 'Phone number is invalid').required('Phone number is required'),
    emailAddress: yup.string().email('Invalid email').required("Email is required"),
    address: yup.string().required("Address is required"),
    desiredCoverageAmount: yup.number(),
    coverageAmount: yup.number(),
    alternatePhoneNumber: yup.string().matches(/^(0)?[0-9]{9,14}$/, 'Phone number is invalid'),
    additionalEmailAddress: yup.string().email('Invalid email'),
    // assigned_agent: yup.string().required("Assigned Agent is required")
  });

  // -----------   initialValues
  const initialValues = {
    title: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    emailAddress: "",
    address: "",
    leadSource: "0",
    leadStatus: "",
    leadScore: "",
    alternatePhoneNumber: "",
    additionalEmailAddress: "",
    instagramProfile: "",
    twitterProfile: "",
    typeOfInsurance: "",
    desiredCoverageAmount: "",
    specificPolicyFeatures: "",
    QualificationStatus: "",
    policyType: "",
    policyNumber: "",
    startDate: "",
    endDate: "",
    coverageAmount: "",
    termLength: "",
    conversionReason: "",
    conversionDateTime: "",
    leadCategory: "",
    leadPriority: "",
    assigned_agent: "",
    createdBy: userid,
    contact_id: _id
  };

  // add Lead api
  const addLead = async (values) => {
    const data = values;
    const result = await apipost('lead/add', data)
    setUserAction(result)

    if (result && result.status === 201) {
      formik.resetForm();
      handleClose();
      toast.success(result.data.message)
    }
  }

  // formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      addLead(values)
    },
  });
  // user api
  const fetchUserData = async () => {
    const result = await apiget('user/list')
    if (result && result.status === 200) {
      setUser(result?.data?.result)
    }
  }

  useEffect(() => {
    fetchUserData();
  }, [])

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
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
          <Typography variant="h6">Add New</Typography>
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
              <Typography style={{ marginBottom: "15px" }} variant="h6">
                Basic Information
              </Typography>
              <Grid
                container
                rowSpacing={3}
                columnSpacing={{ xs: 0, sm: 5, md: 4 }}
              >
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth>
                    <FormLabel>Title</FormLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="title"
                      name="title"
                      label=""
                      size='small'
                      fullWidth
                      value={formik.values.title || null}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.title &&
                        Boolean(formik.errors.title)
                      }
                      helperText={
                        formik.touched.title && formik.errors.title
                      }
                    >
                      <MenuItem value="Mr.">Mr.</MenuItem>
                      <MenuItem value="Mrs.">Mrs. </MenuItem>
                      <MenuItem value="Miss.">Miss. </MenuItem>
                      <MenuItem value="Ms.">Ms. </MenuItem>
                      <MenuItem value="Dr.">Dr. </MenuItem>
                    </Select>
                    <FormHelperText style={{ color: Palette.error.main }}>{formik.touched.title && formik.errors.title}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormLabel>First name</FormLabel>
                  <TextField
                    id="fristName"
                    name="firstName"
                    label=""
                    size='small'
                    maxRows={10}
                    fullWidth
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
                <Grid item xs={12} sm={4} md={4}>
                  <FormLabel>Last name</FormLabel>
                  <TextField
                    id="lastName"
                    name="lastName"
                    label=""
                    size='small'
                    fullWidth
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                    helperText={formik.touched.lastName && formik.errors.lastName}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Date Of Birth</FormLabel>
                  <TextField
                    name='dateOfBirth'
                    type='date'
                    size='small'
                    fullWidth
                    value={formik.values.dateOfBirth}
                    onChange={formik.handleChange}
                    error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
                    helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Phone number</FormLabel>
                  <TextField
                    id="phoneNumber"
                    name="phoneNumber"
                    size='small'
                    fullWidth
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.phoneNumber &&
                      Boolean(formik.errors.phoneNumber)
                    }
                    helperText={
                      formik.touched.phoneNumber && formik.errors.phoneNumber
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormLabel>Email</FormLabel>
                  <TextField
                    id="emailAddress"
                    name="emailAddress"
                    label=""
                    size='small'
                    fullWidth
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
                <Grid item xs={12} >
                  <FormControl fullWidth>
                    <FormLabel>Gender</FormLabel>
                    <RadioGroup row name="gender" onChange={formik.handleChange} value={formik.values.gender}>
                      <FormControlLabel value="Male" control={<Radio />} label="Male" />
                      <FormControlLabel value="Female" control={<Radio />} label="Female" />
                      <FormControlLabel value="Other" control={<Radio />} label="Other" />
                    </RadioGroup>
                    <FormHelperText style={{ color: Palette.error.main }}>{formik.touched.gender && formik.errors.gender}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <FormLabel>Address</FormLabel>
                  <TextField
                    id="address"
                    name="address"
                    label=""
                    size='small'
                    multiline
                    rows={5}
                    fullWidth
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.address &&
                      Boolean(formik.errors.address)
                    }
                    helperText={
                      formik.touched.address && formik.errors.address
                    }
                  />
                </Grid>
              </Grid>
              <Typography
                style={{ marginBottom: "15px", marginTop: "15px" }}
                variant="h6"
              >
                Source Information
              </Typography>
              <Grid
                container
                rowSpacing={3}
                columnSpacing={{ xs: 0, sm: 5, md: 4 }}
              >
                <Grid item xs={12} sm={12} md={12}>
                  <FormControl fullWidth>
                    <FormLabel>Lead Source</FormLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="leadSource"
                      name="leadSource"
                      label=""
                      size='small'
                      fullWidth
                      value={formik.values.leadSource || null}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="call"> Call </MenuItem>
                      <MenuItem value="walk in"> Walk In </MenuItem>
                      <MenuItem value="branch office"> Branch Office </MenuItem>
                      <MenuItem value="referrals"> Referrals </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Typography
                style={{ marginBottom: "15px", marginTop: "15px" }}
                variant="h6"
              >
                Lead Details
              </Typography>
              <Grid
                container
                rowSpacing={3}
                columnSpacing={{ xs: 0, sm: 5, md: 4 }}
              >
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth>
                    <FormLabel>Lead Status</FormLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="leadStatus"
                      name="leadStatus"
                      label=""
                      size='small'
                      fullWidth
                      value={formik.values.leadStatus}
                      onChange={formik.handleChange}

                    >
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="Contacted">Contacted </MenuItem>
                      <MenuItem value="Qualified">Qualified </MenuItem>
                      <MenuItem value="Not Qualified"> Not Qualified </MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Closed/Won">Closed/Won</MenuItem>
                      <MenuItem value="Closed/Lost">Closed/Lost </MenuItem>
                      <MenuItem value="Follow-up Required">
                        Follow-up Required
                      </MenuItem>
                      <MenuItem value="On Hold"> On Hold</MenuItem>
                      <MenuItem value="Converted"> Converted</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth>
                    <FormLabel>Assigned Agent</FormLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="assigned_agent"
                      name="assigned_agent"
                      label=""
                      size='small'
                      fullWidth
                      value={formik.values.assigned_agent}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.assigned_agent &&
                        Boolean(formik.errors.assigned_agent)
                      }
                      helperText={
                        formik.touched.assigned_agent && formik.errors.assigned_agent
                      }
                    >
                      {userdata?.role === 'admin' ?
                        user.map((item) => {
                          return (
                            <MenuItem key={item._id} value={item._id}>
                              {`${item.firstName} ${item.lastName}`}
                            </MenuItem>
                          );
                        })
                        :
                        <MenuItem key={userdata._id} value={userdata._id}>
                          {`${userdata.firstName} ${userdata.lastName}`}
                        </MenuItem>
                      }
                    </Select>
                    <FormHelperText style={{ color: Palette.error.main }}>{formik.touched.assigned_agent && formik.errors.assigned_agent}</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormControl fullWidth>
                    <FormLabel>Lead score or rating</FormLabel>
                    <Typography display="flex">
                      <Rating name="leadScore" precision={0.1} onChange={(event, newValue) => formik.setFieldValue("leadScore", newValue)} />
                    </Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <Typography
                style={{ marginBottom: "15px", marginTop: "15px" }}
                variant="h6"
              >
                Additional Contact Details
              </Typography>
              <Grid
                container
                rowSpacing={3}
                columnSpacing={{ xs: 0, sm: 5, md: 4 }}
              >
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Alternate phone number</FormLabel>
                  <TextField
                    id="alternatePhoneNumber"
                    name="alternatePhoneNumber"
                    size='small'
                    fullWidth
                    value={formik.values.alternatePhoneNumber}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.alternatePhoneNumber &&
                      Boolean(formik.errors.alternatePhoneNumber)
                    }
                    helperText={
                      formik.touched.alternatePhoneNumber && formik.errors.alternatePhoneNumber
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Additional email address</FormLabel>
                  <TextField
                    id="additionalEmailAddress"
                    name="additionalEmailAddress"
                    type="email"
                    size='small'
                    fullWidth
                    value={formik.values.additionalEmailAddress}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.additionalEmailAddress &&
                      Boolean(formik.errors.additionalEmailAddress)
                    }
                    helperText={
                      formik.touched.additionalEmailAddress && formik.errors.additionalEmailAddress
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Instagram profile</FormLabel>
                  <TextField
                    id="instagramProfile"
                    name="instagramProfile"
                    size='small'
                    fullWidth
                    onChange={(e) => formik.setFieldValue('instagramProfile', `${e.target.value}`)}
                  />
                  {formik.values.instagramProfile && <a href={`https://www.instagram.com/${formik.values.instagramProfile}`} target="_blank" rel="noreferrer">Link</a>}
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Twitter profile</FormLabel>
                  <TextField
                    id="twitterProfile"
                    name="twitterProfile"
                    size='small'
                    fullWidth
                    onChange={(e) => formik.setFieldValue('twitterProfile', `${e.target.value}`)}
                  />
                  {formik.values.twitterProfile && <a href={`https://twitter.com/${formik.values.twitterProfile}`} target="_blank" rel="noreferrer">Link</a>}
                </Grid>
              </Grid>
              <Typography
                style={{ marginBottom: "15px", marginTop: "15px" }}
                variant="h6"
              >
                Policy Requirements
              </Typography>
              <Grid
                container
                rowSpacing={3}
                columnSpacing={{ xs: 0, sm: 5, md: 4 }}
              >
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl fullWidth>
                    <FormLabel>Type of insurance</FormLabel>
                    <Autocomplete
                      id="combo-box-demo"
                      options={policyTypeList}
                      getOptionLabel={(item) => item?.lable}
                      value={policyTypeList?.find((item) => item?.value === formik.values.typeOfInsurance)}
                      onChange={(event, newValue) => {
                        formik.setFieldValue("typeOfInsurance", newValue ? newValue?.value : "");
                      }}
                      renderInput={(params) =>
                        <TextField {...params}
                          size="small"
                          error={formik.touched.typeOfInsurance && Boolean(formik.errors.typeOfInsurance)}
                          helperText={formik.touched.typeOfInsurance && formik.errors.typeOfInsurance}
                          placeholder='Select'
                        />}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl fullWidth>
                    <FormLabel>Desired coverage amount</FormLabel>
                    <OutlinedInput
                      id="desiredCoverageAmount"
                      name="desiredCoverageAmount"
                      endAdornment={
                        <InputAdornment position="end">&#8377;</InputAdornment>
                      }
                      type='number'
                      size='small'
                      fullWidth
                      value={formik.values.desiredCoverageAmount}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <FormLabel>Specific policy features</FormLabel>
                  <TextField
                    id="specificPolicyFeatures"
                    name="specificPolicyFeatures"
                    size='small'
                    rows={3}
                    multiline
                    fullWidth
                    value={formik.values.specificPolicyFeatures}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>
              <Typography
                style={{ marginBottom: "15px", marginTop: "15px" }}
                variant="h6"
              >
                Lead Qualification
              </Typography>
              <Grid
                container
                rowSpacing={3}
                columnSpacing={{ xs: 0, sm: 5, md: 4 }}
              >
                <Grid item xs={12} sm={12}>
                  <FormControl fullWidth>
                    <FormLabel>Qualification Status</FormLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="QualificationStatus"
                      name="QualificationStatus"
                      size='small'
                      fullWidth
                      value={formik.values.QualificationStatus}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="Qualified">Qualified</MenuItem>
                      <MenuItem value="Not Qualified">Not Qualified</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

              </Grid>
              <Typography
                style={{ marginBottom: "15px", marginTop: "15px" }}
                variant="h6"
              >
                Lead Conversion Information
              </Typography>
              <Grid
                container
                rowSpacing={3}
                columnSpacing={{ xs: 0, sm: 5, md: 4 }}
              >
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl fullWidth>
                    <FormLabel>Policy Type</FormLabel>
                    <Autocomplete
                      id="combo-box-demo"
                      options={policyTypeList}
                      getOptionLabel={(item) => item?.lable}
                      value={policyTypeList?.find((item) => item?.value === formik.values.policyType)}
                      onChange={(event, newValue) => {
                        formik.setFieldValue("policyType", newValue ? newValue?.value : "");
                      }}
                      renderInput={(params) =>
                        <TextField {...params}
                          size="small"
                          error={formik.touched.policyType && Boolean(formik.errors.policyType)}
                          helperText={formik.touched.policyType && formik.errors.policyType}
                          placeholder='Select'
                        />}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Policy Number</FormLabel>
                  <TextField
                    id="policyNumber"
                    name="policyNumber"
                    type='number'
                    size='small'
                    fullWidth
                    value={formik.values.policyNumber}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Start Date</FormLabel>
                  <TextField
                    id="startDate"
                    name="startDate"
                    type='date'
                    size='small'
                    fullWidth
                    value={formik.values.startDate}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>End Date</FormLabel>
                  <TextField
                    id="endDate"
                    name="endDate"
                    type='date'
                    size='small'
                    fullWidth
                    value={formik.values.endDate}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Coverage Amount</FormLabel>
                  <OutlinedInput
                    id="coverageAmount"
                    name="coverageAmount"
                    endAdornment={
                      <InputAdornment position="end">&#8377;</InputAdornment>
                    }
                    type='number'
                    size='small'
                    fullWidth
                    value={formik.values.coverageAmount}
                    onChange={formik.handleChange}
                  />

                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl fullWidth>
                    <FormLabel>Term Length</FormLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="termLength"
                      name="termLength"
                      label=""
                      size='small'
                      fullWidth
                      value={formik.values.termLength}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="1 year">1 year</MenuItem>
                      <MenuItem value="2 years">2 years </MenuItem>
                      <MenuItem value="5 years">5 years </MenuItem>
                      <MenuItem value="10 years">10 years </MenuItem>
                      <MenuItem value="15 years">15 years</MenuItem>
                    </Select>
                  </FormControl>

                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl fullWidth>
                    <FormLabel>Conversion Reason</FormLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="conversionReason"
                      name="conversionReason"
                      label=""
                      size='small'
                      fullWidth
                      value={formik.values.conversionReason}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="Coverage Needs">Coverage Needs</MenuItem>
                      <MenuItem value="Trust and Reputation">Trust and Reputation</MenuItem>
                      <MenuItem value="Competitive Pricing"> Competitive Pricing</MenuItem>
                      <MenuItem value="Excellent Customer Service">Excellent Customer Service</MenuItem>
                      <MenuItem value="Referrals or Recommendations">Referrals or Recommendations</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Conversion Date&Time</FormLabel>
                  <TextField
                    id=""
                    name="conversionDateTime"
                    type='datetime-local'
                    size='small'
                    fullWidth
                    value={formik.values.conversionDateTime}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>
              <Typography
                style={{ marginBottom: "15px", marginTop: "15px" }}
                variant="h6"
              >
                Lead Segmentation
              </Typography>
              <Grid
                container
                rowSpacing={3}
                columnSpacing={{ xs: 0, sm: 5, md: 4 }}
              >
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl fullWidth>
                    <FormLabel>Lead Category</FormLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="leadCategory"
                      name="leadCategory"
                      label=""
                      size='small'
                      fullWidth
                      value={formik.values.leadCategory}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="Hot Lead">Hot Lead</MenuItem>
                      <MenuItem value="Cold Lead">Cold Lead</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl fullWidth>
                    <FormLabel>Lead Priority</FormLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="leadPriority"
                      name="leadPriority"
                      label=""
                      size='small'
                      fullWidth
                      value={formik.values.leadPriority}
                      onChange={formik.handleChange}
                    >
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContentText>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={formik.handleSubmit} variant='contained' color='primary'>Save</Button>
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