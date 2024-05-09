/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
// @mui
import { DeleteOutline, Message, FileUploadOutlined } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import SmsRoundedIcon from '@mui/icons-material/SmsRounded';
import { Box, Button, Card, Container, Stack, Typography } from '@mui/material';
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// components
import DeleteModel from '../../components/Deletemodle';
import SMSModel from '../../components/SMSModel';
import TableStyle from '../../components/TableStyle';
import Iconify from '../../components/iconify';
import { apiget, apipost, deleteManyApi } from '../../service/api';
import AddLead from './Add';
import EditModel from './Edit';
import ImportModel from '../../components/Import/ImportModel';
import { fetchLeadData } from 'src/redux/slice/leadSlice';
import { useDispatch, useSelector } from 'react-redux';
// ----------------------------------------------------------------------

function CustomToolbar({ selectedRowIds, fetchLeadData }) {
  const [opendelete, setOpendelete] = useState(false);
  const [smsModelOpen, setSmsModelOpen] = useState(false);
  const [userAction, setUserAction] = useState(null);
  const [openImpt, setOpenImpt] = useState(false);
  const userid = localStorage.getItem('user_id');
  const dispatch = useDispatch();

  const fieldsInCrm = [
    { Header: "First Name", accessor: 'firstName', type: 'string', required: true },
    { Header: "Last Name", accessor: 'lastName', type: 'string', required: true },
    { Header: "Gender", accessor: 'gender', type: 'string', required: true },
    { Header: "Phone Number", accessor: 'phoneNumber', type: 'string' },
    { Header: "Email Address", accessor: 'emailAddress', type: 'string', required: true },
    { Header: "Title", accessor: 'title', type: 'string', required: true },
    { Header: "Address", accessor: 'address', type: 'string', required: true },
    { Header: "Date Of Birth", accessor: 'dateOfBirth', type: 'string', required: true },     // string in backend
    { Header: "Create Date", accessor: 'createdOn', type: 'date', isDisplay: false, defVal: new Date() },
    { Header: "Create By", accessor: 'createdBy', type: 'string', isDisplay: false, defVal: userid, required: true },
    { Header: "Deleted", accessor: 'deleted', type: 'boolean', isDisplay: false, defVal: false },
    // { Header: "Average", accessor: 'average', type: 'number', isFloat: true },
  ];

  const handleCloseDelete = () => setOpendelete(false)

  const handleOpenDelete = () => setOpendelete(true)

  const handleSmsModelOpen = () => setSmsModelOpen(true)

  const handleSmsModelClose = () => setSmsModelOpen(false)

  const deleteManyLead = async (data) => {
    const result = await deleteManyApi('lead/deletemany', data)
    dispatch(fetchLeadData())
    setUserAction(result)
    handleCloseDelete();
  }

  const sendSMS = async (payload) => {
    const result = await apipost('sms/lead', payload)
    if (result?.status === 200) {
      setUserAction(result)
      handleSmsModelClose();
      dispatch(fetchLeadData())
    } else {
      handleSmsModelClose();
      // toast.error("Something went wrong")
    }
  }

  const handleOpenImpt = () => setOpenImpt(true);
  const handleCloseImpt = () => setOpenImpt(false);

  useEffect(() => {
    setUserAction(userAction)
  }, [userAction])

  return (
    <GridToolbarContainer>
      <GridToolbar />
      <Button variant="text" sx={{ textTransform: 'capitalize' }} startIcon={<FileUploadOutlined />} onClick={handleOpenImpt}>Import</Button>
      {selectedRowIds && selectedRowIds.length > 0 && <Button variant="text" sx={{ textTransform: 'capitalize' }} startIcon={<SmsRoundedIcon />} onClick={handleSmsModelOpen}>Send SMS</Button>}
      {selectedRowIds && selectedRowIds.length > 0 && <Button variant="text" sx={{ textTransform: 'capitalize' }} startIcon={<DeleteOutline />} onClick={handleOpenDelete}>Delete</Button>}
      <DeleteModel opendelete={opendelete} handleClosedelete={handleCloseDelete} deletedata={deleteManyLead} id={selectedRowIds} />
      <SMSModel open={smsModelOpen} onClose={handleSmsModelClose} sendSMS={sendSMS} ids={selectedRowIds} />
      <ImportModel open={openImpt} handleClose={handleCloseImpt} moduleName="Leads" api="lead/addMany" back="/dashboard/lead" fieldsInCrm={fieldsInCrm} />
    </GridToolbarContainer>
  );
}

const Lead = () => {


  const [userAction, setUserAction] = useState(null);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  // const [allData, setAllData] = useState([]);
  const [leadData, setLeadData] = useState({})
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userid = localStorage.getItem('user_id');
  const userRole = localStorage.getItem("userRole");

  const { data, isLoading } = useSelector((state) => state?.leadDetails)

  // open edit model
  const handleOpenEdit = () => setOpenEdit(true);;
  const handleCloseEdit = () => setOpenEdit(false);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleFirstNameClick = (id) => {
    navigate(`/dashboard/lead/view/${id}`)
  };

  const columns = [
    {
      field: "firstName",
      headerName: "Frist Name",
      flex: 1,
      cellClassName: "name-column--cell name-column--cell--capitalize",
      renderCell: (params) => {
        return (
          <Box onClick={() => handleFirstNameClick(params?.row?._id)}>
            {params.value}
          </Box>
        );
      }
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      cellClassName: "name-column--cell--capitalize",
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
          setLeadData(data)
          handleOpenEdit();
        };
        return (
          <>
            <Button variant='text' size='small' color='primary' onClick={() => handleFirstNameClick(params?.row)}><EditIcon /></Button>
          </>
        );
      }
    },
  ];


  // const fetchdata = async () => {
  //   const result = await apiget(userRole === "admin" ? `lead/list` : `lead/list/?createdBy=${userid}`)
  //   if (result && result.status === 200) {
  //     setAllData(result?.data?.result)
  //   }
  // }

  const handleSelectionChange = (selectionModel) => {
    setSelectedRowIds(selectionModel);
  };


  useEffect(() => {
    // fetchdata();
    dispatch(fetchLeadData())
  }, [userAction])
  return (
    <>
      {/* Add Lead Model */}
      <AddLead open={openAdd} handleClose={handleCloseAdd} setUserAction={setUserAction} />
      {/* Edit Lead Model */}
      <EditModel open={openEdit} handleClose={handleCloseEdit} setUserAction={setUserAction} leadData={leadData} />

      <Container maxWidth>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={"space-between"}>
          <Typography variant="h4" >
            Lead
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent={"flex-end"} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Add New
            </Button>
          </Stack>
        </Stack>
        <TableStyle>
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
                  components={{ Toolbar: () => CustomToolbar({ selectedRowIds, fetchLeadData }) }}
                  checkboxSelection
                  onRowSelectionModelChange={handleSelectionChange}
                  rowSelectionModel={selectedRowIds}
                  getRowId={row => row._id}
                />
              </Card>
            )}

          </Box>
        </TableStyle>
      </Container >
    </>
  );
}

export default Lead