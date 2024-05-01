import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import moment from "moment";
import Papa from 'papaparse';
import ExcelJS from 'exceljs';
import { toast } from 'react-toastify';
import { useFormik } from "formik";
import { Box, Container, Grid, Stack, Card, Typography, MenuItem, Select, FormControl, FormHelperText, InputLabel, Button } from '@mui/material';
import TableStyle from '../../components/TableStyle';
import { apipost } from '../../service/api';

const ImportView = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { fileData, fieldsInCrm, moduleName } = location.state || {};

    const [importedFileFields, setImportedFileFields] = useState([]);
    const [importedFileData, setImportedFileData] = useState([]);
    const [filterData, setFilterData] = useState([]);

    const columns = [
        { Header: 'Fields In Crm', accessor: 'crmFields' },
        { Header: 'Fields In File', accessor: 'fileFields' },
    ];

    const initialFieldValues = Object.fromEntries(
        fieldsInCrm.map(({ accessor }) => [accessor, ''])
    );

    const initialValues = {
        ...initialFieldValues
    };

    const getModuleData = {
        'Leads': {
            url: 'lead/addMany',
            back: '/dashboard/lead'
        },
        'Contacts': {
            url: 'contact/addMany',
            back: '/dashboard/contact'
        }
    };

    const addData = async (records) => {
        const result = await apipost(getModuleData?.[moduleName]?.url, records);
        if (result?.status === 200 || result?.status === 201) {
            navigate(`${getModuleData?.[moduleName]?.back}`);
        } else {
            toast.error("Something went wrong");
        }
    };

    const formik = useFormik({
        initialValues,
        validate: (values) => {
            const errors = {};
            fieldsInCrm?.forEach((field) => {
                if (field.required && field.isDisplay !== false && !values?.[field?.accessor])
                    errors[field?.accessor] = `${field?.Header} is required`;
            });

            return errors;
        },
        onSubmit: (values, { resetForm }) => {
            const records = importedFileData?.map((item, ind) => {
                const record = {};

                fieldsInCrm?.forEach(field => {
                    const selectedField = values[field?.accessor];

                    const fieldValue = item[selectedField] !== undefined
                        ? item[selectedField]
                        : field.defVal !== undefined
                            ? field.type === "boolean"
                                ? Boolean(field.defVal)
                                : field.defVal
                            : '';

                    if (field?.type?.toLowerCase() === "date") {
                        record[field?.accessor] = moment(fieldValue).isValid() ? fieldValue : '';
                    } else if (field?.type?.toLowerCase() === "number" && field?.isFloat) {
                        record[field?.accessor] = parseFloat(fieldValue) || '';
                    } else if (field?.type?.toLowerCase() === "number") {
                        record[field?.accessor] = parseInt(fieldValue, 10) || '';
                    } else {
                        record[field?.accessor] = fieldValue;
                    }
                });

                return record;
            });

            addData(records);
        }
    })

    const { errors, touched, values, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm } = formik;

    const parseFileData = async (file) => {
        const reader = new FileReader();
        const extension = file.name.split('.').pop().toLowerCase();

        reader.onload = async ({ target }) => {

            if (extension === 'csv') {
                const csv = Papa.parse(target.result, {
                    header: true,
                });
                const parsedData = csv?.data;

                if (parsedData && parsedData.length > 0) {
                    setImportedFileData(parsedData);
                    const fileHeadingFields = Object.keys(parsedData[0]);
                    setImportedFileFields(fileHeadingFields);
                } else {
                    toast.error("Empty or invalid CSV file");
                    formik.resetForm();
                    navigate(`${getModuleData?.[moduleName]?.back}`);
                }

            } else if (extension === 'xlsx') {
                const data = new Uint8Array(target.result);
                const workbook = new ExcelJS.Workbook();

                await workbook.xlsx.load(data);

                const worksheet = workbook.getWorksheet(1);
                const jsonData = [];

                // Iterate over rows and cells
                worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                    const rowData = {};
                    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                        rowData[worksheet.getCell(1, colNumber).value] = cell.value;
                    });
                    jsonData.push(rowData);
                });
                jsonData?.splice(0, 1);
                setImportedFileData(jsonData);

                if (jsonData && jsonData.length > 0) {
                    const fileHeadingFields = Object.keys(jsonData[0]);
                    setImportedFileFields(fileHeadingFields);
                } else {
                    toast.error("Empty or invalid XLSX file");
                    formik.resetForm();
                    navigate(`${getModuleData?.[moduleName]?.back}`);
                }
            }
        };

        if (extension === 'csv') {
            reader.readAsText(file);
        } else if (extension === 'xlsx') {
            const blob = new Blob([file]);
            reader.readAsArrayBuffer(blob);
        }
    };

    useEffect(() => {
        if (fileData) {
            parseFileData(fileData);
        }
    }, [fileData]);

    useEffect(() => {
        const filterLeadData = importedFileFields?.filter(field => {
            const result = fieldsInCrm?.find(data => field === data?.accessor || field === data?.Header);
            if (result) {
                setFieldValue(result?.accessor, field);
                return true;
            }
            return false;
        });
        setFilterData(filterLeadData);
    }, [importedFileFields]);

    return (
        <div>
            <Container>
                <Stack direction="row" alignItems="center" mb={5} justifyContent={"space-between"}>
                    <Typography variant="h4" >
                        Import {moduleName}
                    </Typography>
                </Stack>
                <TableStyle>
                    <Box width="100%">
                        <Card style={{ paddingTop: "15px" }}>
                            <Grid container spacing={1} mb={3} pb={2} sx={{ borderBottom: '1px solid #e2e8f0' }}>
                                {columns.map((column, index) => (
                                    <Grid item xs={6} key={index} fontWeight="600" fontSize={{ sm: "14px", lg: "14px" }} color="secondaryGray.900" sx={{ textTransform: "uppercase", textAlign: "center" }}>
                                        <Typography variant="body1">{column.Header}</Typography>
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid container spacing={1} style={{ height: "450px", overflowY: 'auto' }}>
                                {fieldsInCrm && fieldsInCrm?.length > 0 && fieldsInCrm?.map((item, index) => item?.isDisplay !== false && (
                                    <React.Fragment key={index}>
                                        <Grid item xs={6} mt='10px' sx={{ textAlign: 'center' }}>
                                            {item.Header} {item?.required && <span style={{ color: '#ff0000' }}>*</span>}
                                        </Grid>
                                        <Grid item xs={4}>
                                            <FormControl fullWidth>
                                                {/* <InputLabel id={`${item.accessor}-label`}>{item.Header}</InputLabel> */}
                                                <Select
                                                    labelId={`${item.accessor}-label`}
                                                    name={item?.accessor}
                                                    id={item?.accessor}
                                                    value={values?.[item.accessor]}
                                                    onChange={handleChange}
                                                    isSearchable
                                                    error={
                                                        formik.touched?.[item.accessor] &&
                                                        Boolean(formik.errors?.[item.accessor])
                                                    }
                                                    helperText={
                                                        formik.touched?.[item.accessor] && formik.errors?.[item.accessor]
                                                    }
                                                >
                                                    <MenuItem value=''> {filterData ? filterData.find((data) => (item.Header === data || item.accessor === data) && data) ? filterData.find((data) => (item.Header === data || item.accessor === data) && data) : 'Select Field In File' : 'Select Field In File'}</MenuItem>
                                                    {
                                                        importedFileFields?.map(field => (
                                                            <MenuItem value={field} key={field}>{field}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                                {formik.touched?.[item.accessor] && formik.errors?.[item.accessor] && (
                                                    <FormHelperText style={{ color: "#ff0000" }}>{formik.errors?.[item.accessor]}</FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid>
                                    </React.Fragment>
                                ))}
                            </Grid>
                            <Box display="flex" justifyContent="flex-end" mt={5} mr={5} mb={5}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    onClick={formik.handleSubmit}
                                    style={{ textTransform: "capitalize", marginRight: '10px' }}
                                >
                                    Import
                                </Button>
                                <Button
                                    type="reset"
                                    variant="outlined"
                                    style={{ textTransform: "capitalize" }}
                                    color="error"
                                    onClick={() => {
                                        formik.resetForm()
                                        navigate(`${getModuleData?.[moduleName]?.back}`);
                                    }}
                                >
                                    Cancle
                                </Button>
                            </Box>
                        </Card>
                    </Box>
                </TableStyle>
            </Container>
        </div>
    );
}

export default ImportView