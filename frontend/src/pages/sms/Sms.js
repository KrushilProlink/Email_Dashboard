/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Card,
  Container,
  Stack,
  Typography
} from '@mui/material';
// components
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
// sections
// mock
import { useDispatch, useSelector } from 'react-redux';
import DeleteModel from '../../components/Deletemodle';
import TableStyle from '../../components/TableStyle';
import { fetchSmsData } from '../../redux/slice/smsSlice';
import { deleteManyApi } from '../../service/api';

// ----------------------------------------------------------------------
function CustomToolbar({ selectedRowIds, fetchSmsData }) {
  const [opendelete, setOpendelete] = useState(false);
  const dispatch = useDispatch()
  const handleCloseDelete = () => setOpendelete(false)

  const handleOpenDelete = () => setOpendelete(true)

  const deleteManyTasks = async (data) => {
    const result = await deleteManyApi('task/deletemany', data)
    dispatch(fetchSmsData());
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
  const dispatch = useDispatch()
  const userid = localStorage.getItem('user_id');
  const userRole = localStorage.getItem("userRole")

  const { data, isLoading } = useSelector((state) => state?.smsDetails)

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
      width: 250,
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
      width: 250,
      // cellClassName: "name-column--cell name-column--cell--capitalize",
    },

    {
      field: allSms.relatedTo === "Lead" ? "lead_id" : "contact_id",
      headerName: "Related To",
      cellClassName: "name-column--cell name-column--cell--capitalize",
      width: 250,
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
      width: 250,
    },
    {
      field: "status",
      headerName: "Status",
      width: 250,
    },
    {
      field: "startTime",
      headerName: "Start Time",
      width: 250,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleString();
      },
    },

  ];

  useEffect(() => {
    dispatch(fetchSmsData());
  }, [userAction])

  return (
    <>

      {/* Add Tasks */}
      {/* <AddTask open={openTask} handleClose={handleCloseTask} setUserAction={setUserAction} /> */}

      <Container maxWidth>
        <TableStyle>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4">
              Sms List
            </Typography>
            {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenTask}>
              New Sms
            </Button> */}

          </Stack>
          <Box width="100%" >
            {isLoading ? (
              <Card style={{ display: 'flex', justifyContent: 'center', height: "600px" }}>
                <span className="loader" />
              </Card>
            ) : (
              <Card style={{ height: "600px", paddingTop: "15px" }}>
                <DataGrid
                  rows={data}
                  columns={columns}
                  components={{ Toolbar: () => CustomToolbar({ selectedRowIds, fetchSmsData }) }}
                  checkboxSelection={false}
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

export default Sms