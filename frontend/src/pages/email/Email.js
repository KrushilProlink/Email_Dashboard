/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable arrow-body-style */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import moment from "moment";
import { useEffect, useState } from 'react';
// @mui
import { Box, Button, Card, Container, Stack, Typography } from '@mui/material';
// components
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
// sections
// mock
import { DeleteOutline } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import DeleteModel from '../../components/Deletemodle';
import TableStyle from '../../components/TableStyle';
import Iconify from '../../components/iconify/Iconify';
import { fetchEmailData } from '../../redux/slice/emailSlice';
import { deleteManyApi } from '../../service/api';
import AddEmail from './Add';

// ----------------------------------------------------------------------

function CustomToolbar({ selectedRowIds, fetchEmailData }) {
    const [opendelete, setOpendelete] = useState(false);
    const dispatch = useDispatch()
    // open DeleteModel
    const handleCloseDelete = () => setOpendelete(false);
    const handleOpenDelete = () => setOpendelete(true);

    const deleteManyCalls = async (data) => {
        await deleteManyApi('email/deletemany', data)
        dispatch(fetchEmailData());
        handleCloseDelete();
    }

    return (
        <GridToolbarContainer>
            <GridToolbar />
            {selectedRowIds && selectedRowIds.length > 0 && <Button variant="text" sx={{ textTransform: 'capitalize' }} startIcon={<DeleteOutline />} onClick={handleOpenDelete}>Delete</Button>}
            <DeleteModel opendelete={opendelete} handleClosedelete={handleCloseDelete} deletedata={deleteManyCalls} id={selectedRowIds} />
        </GridToolbarContainer>
    );
}

const Email = () => {
    // eslint-disable-next-line no-unused-vars
    const [userAction, setUserAction] = useState(null);
    const [emailList, setEmailList] = useState([]);
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { data, isLoading } = useSelector((state) => state?.emailDetails)

    const userid = localStorage.getItem('user_id');
    const userRole = localStorage.getItem("userRole")

    // open add model
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);

    const handleSelectionChange = (selectionModel) => {
        setSelectedRowIds(selectionModel);
    };

    const columns = [
        {
            field: "subject",
            headerName: "Subject",
            width: 300,
            cellClassName: "name-column--cell",
            renderCell: (params) => {
                const handleFirstNameClick = () => {
                    navigate(`/dashboard/email/view/${params.row._id}`)
                };

                return (
                    <Box onClick={handleFirstNameClick}>
                        {params.value}
                    </Box>
                );
            }
        },
        {
            field: "sender",
            headerName: "Sender",
            width: 300,
            renderCell: (params) => {
                return (
                    <Box >
                        {params?.value?.emailAddress}
                    </Box>
                );
            }
        },
        {
            field: "receiver",
            headerName: "Receiver",
            width: 300,
        },
        {
            field: "createdBy",
            headerName: "Created By",
            width: 300,
            renderCell: (params) => {
                return (
                    <Box>
                        {`${params.row.createdBy.firstName} ${params.row.createdBy.lastName}`}
                    </Box>
                );
            }
        },
        {
            field: "status",
            headerName: "Status",
            width: 300,
        },
        {
            field: "createdOn",
            headerName: "Create Date",
            width: 300,
            renderCell: (params) => {
                return (
                    <>
                        {moment(params?.row?.createdOn).format('lll')}
                    </>
                );
            }
        }
    ];

    useEffect(() => {
        dispatch(fetchEmailData());
    }, [userAction])

    return (
        <>
            <AddEmail open={openAdd} handleClose={handleCloseAdd} setUserAction={setUserAction} />

            <Container maxWidth>
                <TableStyle>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4">
                            Emails
                        </Typography>
                        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd} >
                            Add New
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
                                    components={{ Toolbar: () => CustomToolbar({ selectedRowIds, fetchEmailData }) }}
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

export default Email