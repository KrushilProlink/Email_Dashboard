/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
// @mui
import { DeleteOutline } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  Typography
} from '@mui/material';
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DeleteModel from '../../components/Deletemodle';
import TableStyle from '../../components/TableStyle';
import Iconify from '../../components/iconify';
import AddTask from '../../components/task/AddTask';
import { fetchTaskData } from '../../redux/slice/taskSlice';
import { deleteManyApi } from '../../service/api';

// ----------------------------------------------------------------------
function CustomToolbar({ selectedRowIds, fetchTaskData }) {
  const [opendelete, setOpendelete] = useState(false);
  const dispatch = useDispatch()
  const handleCloseDelete = () => setOpendelete(false)

  const handleOpenDelete = () => setOpendelete(true)

  const deleteManyTasks = async (data) => {
    const result = await deleteManyApi('task/deletemany', data)
    dispatch(fetchTaskData());
    handleCloseDelete();
  }

  return (
    <GridToolbarContainer>
      <GridToolbar />
      {selectedRowIds && selectedRowIds.length > 0 && <Button variant="text" sx={{ textTransform: 'capitalize' }} startIcon={<DeleteOutline />} onClick={handleOpenDelete}>Delete</Button>}
      <DeleteModel opendelete={opendelete} handleClosedelete={handleCloseDelete} deletedata={deleteManyTasks} id={selectedRowIds} />
    </GridToolbarContainer>
  );
}

const Task = () => {
  const [allTask, setAllTask] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [openTask, setOpenTask] = useState(false);
  const [userAction, setUserAction] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const userid = localStorage.getItem('user_id');
  const userRole = localStorage.getItem("userRole")
  const { data, isLoading } = useSelector((state) => state?.taskDetails)

  const handleSelectionChange = (selectionModel) => {
    setSelectedRowIds(selectionModel);
  };

  // open task model
  const handleOpenTask = () => setOpenTask(true);
  const handleCloseTask = () => setOpenTask(false);

  const columns = [
    {
      field: "subject",
      headerName: "Subject",
      width: 200,
      cellClassName: "name-column--cell name-column--cell--capitalize",
      renderCell: (params) => {
        const handleFirstNameClick = () => {
          navigate(`/dashboard/task/view/${params.row._id}`)
        };

        return (
          <Box onClick={handleFirstNameClick}>
            {params.value}
          </Box>
        );
      }
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 200,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleString();
      },
    },
    {
      field: "endDate",
      headerName: "End Date",
      width: 200,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleString();
      },
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 200,
    },
    {
      field: allTask.relatedTo === "Lead" ? "lead_id" : "contact_id",
      headerName: "Related To",
      cellClassName: "name-column--cell name-column--cell--capitalize",
      width: 200,
      renderCell: (params) => {
        const handleFirstNameClick = () => {
          navigate(params?.row?.relatedTo === "Lead" ? `/dashboard/lead/view/${params?.row?.lead_id?._id}` : `/dashboard/contact/view/${params?.row?.contact_id?._id}`)
        };
        return (
          <Box onClick={handleFirstNameClick}>
            {params?.row?.relatedTo === "Lead" ? `${params?.row?.lead_id?.firstName} ${params?.row?.lead_id?.lastName}` : params?.row?.relatedTo === "Contact" ? `${params?.row?.contact_id?.firstName} ${params?.row?.contact_id?.lastName}` : "-"
            }
          </Box>
        );
      }
    },
    {
      field: "createdBy",
      headerName: "Assigned User",
      cellClassName: "name-column--cell name-column--cell--capitalize",
      width: 200,
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

  useEffect(() => {
    dispatch(fetchTaskData())
  }, [userAction])

  return (
    <>

      {/* Add Tasks */}
      <AddTask open={openTask} handleClose={handleCloseTask} setUserAction={setUserAction} />

      <Container maxWidth>
        <TableStyle>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4">
              Tasks
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenTask}>
              Add New
            </Button>
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
                  components={{ Toolbar: () => CustomToolbar({ selectedRowIds, fetchTaskData }) }}
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

export default Task