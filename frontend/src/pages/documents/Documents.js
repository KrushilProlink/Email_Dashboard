/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable arrow-body-style */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
// @mui
import { Card, Stack, Button, Container, Typography, Box } from '@mui/material';
// components
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import { DeleteOutline } from '@mui/icons-material';
import Iconify from '../../components/iconify';
// sections
import AddDocument from './Add'
import { apidelete, apiget, deleteManyApi } from '../../service/api';
import TableStyle from '../../components/TableStyle';
import DeleteModel from '../../components/Deletemodle';
import AssignToUserModel from './AssignTo';
import { constant } from '../../constant';
import { fetchDocumentData } from '../../redux/slice/documentSlice';
import { useDispatch, useSelector } from 'react-redux';
// ----------------------------------------------------------------------

function CustomToolbar({ selectedRowIds, fetchDocumentData }) {
    const [opendelete, setOpendelete] = useState(false);
    const dispatch = useDispatch()
    const handleCloseDelete = () => {
        setOpendelete(false)
    }

    const handleOpenDelete = () => {
        setOpendelete(true)
    }

    // delete many api
    const deleteManyContact = async (data) => {
        await deleteManyApi('document/deletemany', data)
        dispatch(fetchDocumentData());
        handleCloseDelete();
    }

    return (
        <GridToolbarContainer>
            <GridToolbar />
            {selectedRowIds && selectedRowIds.length > 0 && <Button variant="text" sx={{ textTransform: 'capitalize' }} startIcon={<DeleteOutline />} onClick={handleOpenDelete}>Delete</Button>}
            <DeleteModel opendelete={opendelete} handleClosedelete={handleCloseDelete} deletedata={deleteManyContact} id={selectedRowIds} />

        </GridToolbarContainer>
    );
}

const Documents = () => {
    const [userAction, setUserAction] = useState(null);
    const [documentList, setDocumentList] = useState([])
    const [openAdd, setOpenAdd] = useState(false);
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [openAssignTo, setOpenAssignTo] = useState(false);
    const [documentId, setDocumentId] = useState('');
    const dispatch = useDispatch()
    const userid = localStorage.getItem('user_id');
    const userRole = localStorage.getItem("userRole");

    const { data, isLoading } = useSelector((state) => state?.documentDetails)

    const handleOpenAdd = () => {
        setOpenAdd(true)
    }
    const handleCloseAdd = () => {
        setOpenAdd(false)
    }

    const handleOpenAssignTo = (id) => {
        setDocumentId(id);
        setOpenAssignTo(true)
    }

    const handleCloseAssignTo = () => {
        setOpenAssignTo(false)
    }

    const handleSelectionChange = (selectionModel) => {
        setSelectedRowIds(selectionModel);
    };

    // file download api
    const downloadFile = async (id) => {
        const result = await apiget(`document/file/${id}`)
        setUserAction(result)
    }

    // file delete api
    const deleteFile = async (id) => {
        const result = await apidelete(`document/delete/${id}`)
        setUserAction(result)
    }

    const columns = [
        {
            field: "file",
            headerName: "File",
            width: 370,
        },

        {
            field: "fileName",
            headerName: "File Name",
            width: 370,
        },
        {
            field: "createdOn",
            headerName: "CreateOn",
            width: 370,
            valueFormatter: (params) => {
                const date = new Date(params.value);
                return date.toDateString();
            },
        },
        {
            field: "action",
            headerName: "Action",
            width: 370,
            sortable: false,
            renderCell: (params) => {
                const handleFirstNameClick = async () => { downloadFile(params.row._id) };
                const downloadUrl = `${constant.baseUrl}document/file/${params.row._id}`;

                return (
                    <Box onClick={handleFirstNameClick}>
                        <Stack direction={"row"} spacing={2}>
                            <a href={downloadUrl}><Button variant='contained' size='small'>Download</Button></a>
                            <Button variant='outlined' size='small' color='error' onClick={() => deleteFile(params.row._id)}>Delete</Button>
                            {userRole !== "user" && <Button variant='outlined' size='small' onClick={() => handleOpenAssignTo(params.row._id)}>Assign To User</Button>}
                        </Stack>
                    </Box>
                );
            }
        },

    ];

    // fetch documents list
    useEffect(() => {
        dispatch(fetchDocumentData());
    }, [userAction])
    return (
        <>
            {/* Add Document Model */}
            <AddDocument open={openAdd} handleClose={handleCloseAdd} setUserAction={setUserAction} />

            <AssignToUserModel open={openAssignTo} handleClose={handleCloseAssignTo} documentId={documentId} />

            <Container maxWidth>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4">
                        Documents
                    </Typography>
                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
                        Add New
                    </Button>
                </Stack>
                <TableStyle>
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
                                    components={{ Toolbar: () => CustomToolbar({ selectedRowIds, fetchDocumentData }) }}
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
        </>
    );
}

export default Documents