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
import { DeleteOutline, FileUploadOutlined } from '@mui/icons-material';
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
import ImportModel from '../../components/Import/ImportModel';
import { fetchContactData } from 'src/redux/slice/contactSlice';
import { useDispatch, useSelector } from 'react-redux';

// ----------------------------------------------------------------------

function CustomToolbar({ selectedRowIds, fetchContactData }) {
    const [opendelete, setOpendelete] = useState(false);
    const [smsModelOpen, setSmsModelOpen] = useState(false);
    const [openImpt, setOpenImpt] = useState(false);
    const dispatch = useDispatch();
    const userid = localStorage.getItem('user_id');

    const fieldsInCrm = [
        { Header: "First Name", accessor: 'firstName', type: 'string', required: true },
        { Header: "Last Name", accessor: 'lastName', type: 'string', required: true },
        { Header: "Gender", accessor: 'gender', type: 'string', required: true },
        { Header: "Phone Number", accessor: 'phoneNumber', type: 'string' },
        { Header: "Email Address", accessor: 'emailAddress', type: 'string', required: true },
        { Header: "Date Of Birth", accessor: 'dateOfBirth', type: 'date', required: true },
        { Header: "Created On", accessor: 'createdOn', type: 'date', isDisplay: false, defVal: new Date() },
        { Header: "Create By", accessor: 'createdBy', type: 'string', isDisplay: false, defVal: userid, required: true },
        { Header: "Deleted", accessor: 'deleted', type: 'boolean', isDisplay: false, defVal: false },
    ];

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
        handleCloseDelete();
        dispatch(fetchContactData())
    }

    const sendSMS = async (payload) => {
        const result = await apipost('sms/contact', payload)
        if (result?.status === 200) {
            handleSmsModelClose();
            dispatch(fetchContactData())
        } else {
            handleSmsModelClose();
            // toast.error("Something went wrong")
        }
    }

    const handleOpenImpt = () => setOpenImpt(true);
    const handleCloseImpt = () => setOpenImpt(false);

    return (
        <GridToolbarContainer>
            <GridToolbar />
            <Button variant="text" sx={{ textTransform: 'capitalize' }} startIcon={<FileUploadOutlined />} onClick={handleOpenImpt}>Import</Button>
            {selectedRowIds && selectedRowIds.length > 0 && <Button variant="text" sx={{ textTransform: 'capitalize' }} startIcon={<SmsRoundedIcon />} onClick={handleSmsModelOpen}>Send SMS</Button>}
            {selectedRowIds && selectedRowIds.length > 0 && <Button variant="text" sx={{ textTransform: 'capitalize' }} startIcon={<DeleteOutline />} onClick={handleOpenDelete}>Delete</Button>}
            <DeleteModel opendelete={opendelete} handleClosedelete={handleCloseDelete} deletedata={deleteManyContact} id={selectedRowIds} />
            <SMSModel open={smsModelOpen} onClose={handleSmsModelClose} sendSMS={sendSMS} ids={selectedRowIds} />
            <ImportModel open={openImpt} handleClose={handleCloseImpt} moduleName="Contacts" api="contact/addMany" back="/dashboard/contact" fieldsInCrm={fieldsInCrm} />
        </GridToolbarContainer>
    );
}


const Contact = () => {

    const [contactData, setContactData] = useState({});
    const [userAction, setUserAction] = useState(null);
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [id, setId] = useState('');
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userid = localStorage.getItem('user_id');
    const userRole = localStorage.getItem("userRole")

    const { data, isLoading } = useSelector((state) => state?.contactDetails)

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
                    setContactData(data)
                    handleOpenEdit();
                };
                return (
                    <Box>
                        <Stack direction={"row"} spacing={2}>
                            <Button variant='text' size='small' color='primary' onClick={() => handleFirstNameClick(params?.row)}><EditIcon /></Button>
                        </Stack>
                    </Box>
                );
            }
        },

    ];

    // const fetchdata = async () => {
    //     const result = await apiget(userRole === "admin" ? `contact/list` : `contact/list/?createdBy=${userid}`)
    //     if (result && result.status === 200) {
    //         setAllData(result?.data?.result)
    //     }
    // }

    useEffect(() => {
        dispatch(fetchContactData());
    }, [userAction])
    return (
        <>
            {/* Add Contact Model */}
            <AddContact open={openAdd} handleClose={handleCloseAdd} setUserAction={setUserAction} />
            {/* Edit Contact Model */}
            <EditContact open={openEdit} handleClose={handleCloseEdit} contactData={contactData} setUserAction={setUserAction} />

            <Container maxWidth>
                <TableStyle>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4">
                            Contact
                        </Typography>
                        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
                            Add New
                        </Button>
                    </Stack>
                    <Box width="100%">
                        {isLoading ? (
                            <Card style={{ display: 'flex', justifyContent: 'center', height: "600px" }}>
                                <span class="loader"></span>
                            </Card>
                        ) : (
                            <Card style={{ height: "600px", paddingTop: "15px" }}>
                                <DataGrid
                                    rows={data}
                                    columns={columns}
                                    components={{ Toolbar: () => CustomToolbar({ selectedRowIds, fetchContactData }) }}
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

export default Contact