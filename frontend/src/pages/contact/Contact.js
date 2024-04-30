/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
// @mui
import {
    Box,
    Button,
    Card,
    Container,
    Stack,
    Typography,
} from '@mui/material';
import { DeleteOutline } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import SmsRoundedIcon from '@mui/icons-material/SmsRounded';
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// components
import Iconify from '../../components/iconify';
import DeleteModel from '../../components/Deletemodle';
import SMSModel from '../../components/SMSModel';
import TableStyle from '../../components/TableStyle';
import { apiget, apipost, deleteManyApi } from '../../service/api';
import AddContact from './Add';
import EditContact from './Edit';

// ----------------------------------------------------------------------

function CustomToolbar({ selectedRowIds, fetchdata }) {
    const [opendelete, setOpendelete] = useState(false);
    const [smsModelOpen, setSmsModelOpen] = useState(false);

    const handleSmsModelOpen = () => setSmsModelOpen(true)

    const handleSmsModelClose = () => setSmsModelOpen(false)

    const handleCloseDelete = () => {
        setOpendelete(false)
    }

    const handleOpenDelete = () => {
        setOpendelete(true)
    }

    const deleteManyContact = async (data) => {
        await deleteManyApi('contact/deletemany', data)
        fetchdata()
        handleCloseDelete();
    }

    const sendSMS = async (payload) => {
        const result = await apipost('contact/sms', payload)
        if (result?.status === 200) {
            handleSmsModelClose();
            fetchdata()
            toast.success(result?.data?.message)
        } else {
            toast.error("Something went wrong")
        }
    }

    return (
        <GridToolbarContainer>
            <GridToolbar />
            {selectedRowIds && selectedRowIds.length > 0 && <Button variant="text" sx={{ textTransform: 'capitalize' }} startIcon={<SmsRoundedIcon />} onClick={handleSmsModelOpen}>Send SMS</Button>}
            {selectedRowIds && selectedRowIds.length > 0 && <Button variant="text" sx={{ textTransform: 'capitalize' }} startIcon={<DeleteOutline />} onClick={handleOpenDelete}>Delete</Button>}
            <DeleteModel opendelete={opendelete} handleClosedelete={handleCloseDelete} deletedata={deleteManyContact} id={selectedRowIds} />
            <SMSModel open={smsModelOpen} onClose={handleSmsModelClose} sendSMS={sendSMS} ids={selectedRowIds} />
        </GridToolbarContainer>
    );
}


const Contact = () => {

    const [contactList, setContactList] = useState([]);
    const [userAction, setUserAction] = useState(null);
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [id, setId] = useState('');
    const navigate = useNavigate()

    const userid = localStorage.getItem('user_id');
    const userRole = localStorage.getItem("userRole")

    // open add model
    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);

    // open edit model
    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);

    const handleSelectionChange = (selectionModel) => {
        setSelectedRowIds(selectionModel);
    };

    const columns = [
        {
            field: "firstName",
            headerName: "Frist Name",
            flex: 1,
            cellClassName: "name-column--cell name-column--cell--capitalize",
            renderCell: (params) => {
                const handleFirstNameClick = () => {
                    navigate(`/dashboard/contact/view/${params.id}`)
                };

                return (
                    <Box onClick={handleFirstNameClick}>
                        {params.value}
                    </Box>
                );
            }
        },
        {
            field: "lastName",
            headerName: "Last Name",
            flex: 1,
            cellClassName: "name-column--cell--capitalize"
        },
        {
            field: "gender",
            headerName: "Gender",
            flex: 1,
        },
        {
            field: "phoneNumber",
            headerName: "Phone Number",
            flex: 1,
        },
        {
            field: "emailAddress",
            headerName: "Email Address",
            flex: 1,
        },
        {
            field: "action",
            headerName: "Action",
            flex: 1,
            // eslint-disable-next-line arrow-body-style
            renderCell: (params) => {
                const handleFirstNameClick = async (data) => {
                    setId(data)
                    handleOpenEdit();
                };
                return (
                    <Box>
                        <EditContact open={openEdit} handleClose={handleCloseEdit} id={id} fetchContact={fetchdata} />
                        <Stack direction={"row"} spacing={2}>
                            <Button variant='text' size='small' color='primary' onClick={() => handleFirstNameClick(params.row._id)}><EditIcon /></Button>
                        </Stack>
                    </Box>
                );
            }
        },

    ];

    const fetchdata = async () => {
        const result = await apiget(userRole === "admin" ? `contact/list` : `contact/list/?createdBy=${userid}`)
        if (result && result.status === 200) {
            setContactList(result?.data?.result)
        }
    }

    useEffect(() => {
        fetchdata();
    }, [userAction])
    return (
        <>
            {/* Add Contact Model */}
            <AddContact open={openAdd} handleClose={handleCloseAdd} setUserAction={setUserAction} />

            <Container>
                <TableStyle>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4">
                            Contact
                        </Typography>
                        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
                            New Contact
                        </Button>
                    </Stack>
                    <Box width="100%">
                        <Card style={{ height: "600px", paddingTop: "15px" }}>
                            <DataGrid
                                rows={contactList}
                                columns={columns}
                                components={{ Toolbar: () => CustomToolbar({ selectedRowIds, fetchdata }) }}
                                checkboxSelection
                                onRowSelectionModelChange={handleSelectionChange}
                                rowSelectionModel={selectedRowIds}
                                getRowId={row => row._id}
                            />
                        </Card>
                    </Box>
                </TableStyle>
            </Container>
        </>
    );
}

export default Contact