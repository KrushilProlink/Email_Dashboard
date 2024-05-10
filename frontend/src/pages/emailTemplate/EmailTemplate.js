import { Box, Button, Card, Container, Stack, Typography } from '@mui/material';
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { DeleteOutline } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import TableStyle from '../../components/TableStyle';
import Iconify from '../../components/iconify/Iconify';
import { apiget, deleteManyApi } from '../../service/api';
import DeleteModel from '../../components/Deletemodle'
import { fetchTemplateData } from '../../redux/slice/emailTemplateSlice';

function CustomToolbar({ selectedRowIds, fetchTemplateData }) {
    const [opendelete, setOpendelete] = useState(false);
    const [userAction, setUserAction] = useState(null);
    const dispatch = useDispatch();
    const handleCloseDelete = () => setOpendelete(false)

    const handleOpenDelete = () => setOpendelete(true)

    const deleteManyEmailTemplate = async (data) => {
        const result = await deleteManyApi('emailtemplate/deletemanny', data)
        dispatch(fetchTemplateData())
        setUserAction(result)
        handleCloseDelete();
    }

    useEffect(() => {
        setUserAction(userAction)
    }, [userAction])

    return (
        <GridToolbarContainer>
            <GridToolbar />
            {selectedRowIds && selectedRowIds.length > 0 && <Button variant="text" sx={{ textTransform: 'capitalize' }} startIcon={<DeleteOutline />} onClick={handleOpenDelete}>Delete</Button>}
            <DeleteModel opendelete={opendelete} handleClosedelete={handleCloseDelete} deletedata={deleteManyEmailTemplate} id={selectedRowIds} />
        </GridToolbarContainer>
    );
}

const EmailTemplate = () => {

    // const [designList, setDesignList] = useState([])
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userid = localStorage.getItem('user_id');
    const userRole = localStorage.getItem("userRole");

    const { data, isLoading } = useSelector((state) => state?.tempDetails)

    const columns = [
        {
            field: "name",
            headerName: "Template Name",
            width: 370,
            cellClassName: "name-column--cell name-column--cell--capitalize",
            renderCell: (params) => {
                const handleFirstNameClick = () => {
                    navigate(`/dashboard/emailtemplate/view/${params.row._id}`)
                };

                return (
                    <Box onClick={handleFirstNameClick}>
                        {params.value}
                    </Box>
                );
            }

        },
        {
            field: "createdOn",
            headerName: "CreatedOn",
            width: 370,
            valueFormatter: (params) => {
                const date = new Date(params.value);
                return date.toLocaleString();
            },
        },
        {
            field: "modifiedOn",
            headerName: "ModifiedOn",
            width: 370,
            valueFormatter: (params) => {
                const date = new Date(params.value);
                return date.toLocaleString();
            },
        },
        {
            field: "createdBy",
            headerName: "Created By",
            cellClassName: "name-column--cell name-column--cell--capitalize",
            width: 370,
            renderCell: (params) => {
                const handleFirstNameClick = () => {
                    navigate(`/dashboard/user/view/${params?.row?.createdBy?._id}`)
                };
                return (
                    <Box onClick={handleFirstNameClick}>
                        {`${params.row.createdBy.firstName} ${params.row.createdBy.lastName}`}
                    </Box>
                );
            }
        }
    ];

    const handleSelectionChange = (selectionModel) => {
        setSelectedRowIds(selectionModel);
    };

    // const fetchdata = async () => {
    //     const result = await apiget(userRole === "admin" ? `emailtemplate/list` : `emailtemplate/list/?createdBy=${userid}`)
    //     if (result && result.status === 200) {
    //         setDesignList(result.data.result)
    //     }
    // }

    useEffect(() => {
        dispatch(fetchTemplateData())
    }, [])


    return (
        <div>
            <Container maxWidth>
                <TableStyle>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4">
                            Email Template List
                        </Typography>
                        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} >
                            <Link to="/dashboard/emailtemplate/add" style={{ textDecoration: "none", color: "white" }}>Add New</Link>
                        </Button>
                    </Stack>
                    <Box width="100%">
                        {isLoading ? (
                            <Card style={{ display: 'flex', justifyContent: 'center', height: "600px" }}>
                                <span className="loader" />
                            </Card>
                        ) : (
                            <Card style={{ height: "600px", paddingTop: "15px" }}>
                                <DataGrid
                                    rows={data}
                                    columns={columns}
                                    components={{ Toolbar: () => CustomToolbar({ selectedRowIds, fetchTemplateData }) }}
                                    checkboxSelection
                                    onRowSelectionModelChange={handleSelectionChange}
                                    rowSelectionModel={selectedRowIds}
                                    getRowId={row => row._id}
                                />
                            </Card>
                        )}

                    </Box>
                </TableStyle>
            </Container>
        </div>
    )
}

export default EmailTemplate
