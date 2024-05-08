/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Box,
  tableBodyClasses,
} from '@mui/material';
// components
import { useNavigate } from 'react-router-dom';
import { nbNO } from '@mui/x-date-pickers';
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import { DeleteOutline } from '@mui/icons-material';
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
// mock
import USERLIST from '../../_mock/user';
import Palette from '../../theme/palette';
import { apiget, deleteManyApi } from '../../service/api';
import DeleteModel from '../../components/Deletemodle'
import TableStyle from '../../components/TableStyle';
import AddTask from '../../components/task/AddTask'
// ----------------------------------------------------------------------
function CustomToolbar({ selectedRowIds, fetchdata }) {
  const [opendelete, setOpendelete] = useState(false);

  const handleCloseDelete = () => setOpendelete(false)

  const handleOpenDelete = () => setOpendelete(true)

  const deleteManyTasks = async (data) => {
    const result = await deleteManyApi('task/deletemany', data)
    fetchdata();
    handleCloseDelete();
  }

  return (
    <GridToolbarContainer>
      <GridToolbar />
      {/* {selectedRowIds && selectedRowIds.length > 0 && <Button variant="text" sx={{ textTransform: 'capitalize' }} startIcon={<DeleteOutline />} onClick={handleOpenDelete}>Delete</Button>} */}
      <DeleteModel opendelete={opendelete} handleClosedelete={handleCloseDelete} deletedata={deleteManyTasks} id={selectedRowIds} />
    </GridToolbarContainer>
  );
}

const Sms = () => {
  const [allSms, setAllSms] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [openTask, setOpenTask] = useState(false);
  const [userAction, setUserAction] = useState(null)
  const navigate = useNavigate()

  const userid = localStorage.getItem('user_id');
  const userRole = localStorage.getItem("userRole")

  const handleSelectionChange = (selectionModel) => {
    setSelectedRowIds(selectionModel);
  };

  // open task model
  const handleOpenTask = () => setOpenTask(true);
  const handleCloseTask = () => setOpenTask(false);

  const columns = [
    {
      field: "senderName",
      headerName: "Sender Name",
      cellClassName: "name-column--cell name-column--cell--capitalize",
      flex: 1,
      renderCell: (params) => {
        const handleFirstNameClick = () => {
          navigate(`/dashboard/sms/view/${params.row._id}`)
        };
        return (
          <Box onClick={handleFirstNameClick}>
            {params.value}
          </Box>
        );
      }
    },
    {
      field: "reciverName",
      headerName: "Reciver Name",
      flex: 1,
      // cellClassName: "name-column--cell name-column--cell--capitalize",
    },

    {
      field: allSms.relatedTo === "Lead" ? "lead_id" : "contact_id",
      headerName: "Related To",
      cellClassName: "name-column--cell name-column--cell--capitalize",
      flex: 1,
      renderCell: (params) => {
        const handleFirstNameClick = () => {
          navigate(params?.row?.relatedTo === "Lead" ? `/dashboard/lead/view/${params?.row?.lead_id}` : params?.row?.relatedTo === "Contact" ? `/dashboard/contact/view/${params?.row?.contact_id}` : params?.row?.relatedTo === "Task" ? `/dashboard/task/view/${params?.row?.task_id}` : "")
        };
        return (
          <Box onClick={handleFirstNameClick}>
            {params?.row?.relatedTo}
          </Box>
        );
      }
    },
    {
      field: "reciverNumber",
      headerName: "Receiver Number",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "startTime",
      headerName: "Start Time",
      flex: 1,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleString();
      },
    },

  ];

  const fetchdata = async () => {
    const result = await apiget(userRole === "admin" ? `sms/list` : `sms/list/?createdBy=${userid}`)
    if (result && result.status === 200) {
      setAllSms(result?.data?.result)
    }
  }

  useEffect(() => {
    fetchdata();
  }, [userAction])

  return (
    <>

      {/* Add Tasks */}
      <AddTask open={openTask} handleClose={handleCloseTask} setUserAction={setUserAction} />

      <Container maxWidth>
        <TableStyle>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4">
              Sms List
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenTask}>
              New Sms
            </Button>

          </Stack>
          <Box width="100%" >
            <Card style={{ height: "600px", paddingTop: "15px" }}>
              <DataGrid
                rows={allSms}
                columns={columns}
                components={{ Toolbar: () => CustomToolbar({ selectedRowIds, fetchdata }) }}
                checkboxSelection={false}
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

export default Sms