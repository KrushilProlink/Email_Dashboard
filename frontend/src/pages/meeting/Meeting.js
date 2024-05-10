/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
// @mui
import { Card, Stack, Button, Container, Typography, Box } from '@mui/material';
// components
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import { DeleteOutline } from '@mui/icons-material';
// sections
// mock
import { apiget, deleteManyApi } from '../../service/api';
import DeleteModel from '../../components/Deletemodle'
import TableStyle from '../../components/TableStyle';
import Iconify from '../../components/iconify/Iconify';
import AddMeeting from '../../components/meeting/Addmeetings'
import { fetchMeetingData } from '../../redux/slice/meetingSlice';
import { useDispatch, useSelector } from 'react-redux';
// ----------------------------------------------------------------------
function CustomToolbar({ selectedRowIds, fetchMeetingData }) {
  const [opendelete, setOpendelete] = useState(false);
  const dispatch = useDispatch()
  const handleCloseDelete = () => setOpendelete(false);
  const handleOpenDelete = () => setOpendelete(true);



  const deleteManyMettings = async (data) => {
    await deleteManyApi('meeting/deletemany', data)
    dispatch(fetchMeetingData());
    handleCloseDelete();
  }

  return (
    <GridToolbarContainer>
      <GridToolbar />
      {selectedRowIds && selectedRowIds.length > 0 && <Button variant="text" sx={{ textTransform: 'capitalize' }} startIcon={<DeleteOutline />} onClick={handleOpenDelete}>Delete</Button>}
      <DeleteModel opendelete={opendelete} handleClosedelete={handleCloseDelete} deletedata={deleteManyMettings} id={selectedRowIds} />
    </GridToolbarContainer>
  );
}

const Meeting = () => {
  const [openMeeting, setOpenMeeting] = useState(false);
  const [userAction, setUserAction] = useState(null);
  const [allMeeting, setAllMeeting] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data, isLoading } = useSelector((state) => state?.meetingDetails)
  const userid = localStorage.getItem('user_id');
  const userRole = localStorage.getItem("userRole")

  const handleSelectionChange = (selectionModel) => {
    setSelectedRowIds(selectionModel);
  };

  // open Meeting model
  const handleOpenMeeting = () => setOpenMeeting(true);
  const handleCloseMeeting = () => setOpenMeeting(false);

  const columns = [
    {
      field: "subject",
      headerName: "Subject",
      width: 215,
      cellClassName: "name-column--cell name-column--cell--capitalize",
      renderCell: (params) => {
        const handleFirstNameClick = () => {
          navigate(`/dashboard/meeting/view/${params.row._id}`)
        };

        return (
          <Box onClick={handleFirstNameClick}>
            {params.value}
          </Box>
        );
      }
    },
    {
      field: "startDate",
      headerName: "Start Date",
      width: 215,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleString();
      },
    },
    {
      field: "endDate",
      headerName: "End Date",
      width: 215,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleString();
      },
    },
    {
      field: "duration",
      headerName: "Duration",
      width: 215,
    },
    {
      field: "status",
      headerName: "Status",
      width: 215,
    },
    {
      field: allMeeting.relatedTo === "Lead" ? "lead_id" : "contact_id",
      headerName: "Related To",
      cellClassName: "name-column--cell name-column--cell--capitalize",
      width: 215,
      renderCell: (params) => {
        const handleFirstNameClick = () => {
          navigate(params?.row?.relatedTo === "Lead" ? `/dashboard/lead/view/${params?.row?.lead_id?._id}` : `/dashboard/contact/view/${params?.row?.contact_id?._id}`)
        };
        return (
          <Box onClick={handleFirstNameClick}>
            {params?.row?.relatedTo === "Lead" ? `${params?.row?.lead_id?.firstName} ${params?.row?.lead_id?.lastName}` : `${params?.row?.contact_id?.firstName} ${params?.row?.contact_id?.lastName}`
            }
          </Box>
        );
      }
    },
    {
      field: "createdBy",
      headerName: "Assigned User",
      cellClassName: "name-column--cell name-column--cell--capitalize",
      width: 215,
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
    dispatch(fetchMeetingData());
  }, [userAction])

  return (
    <>
      {/* Add Meeting */}
      <AddMeeting open={openMeeting} handleClose={handleCloseMeeting} setUserAction={setUserAction} />

      <Container maxWidth>
        <TableStyle>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4">
              Meetings List
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenMeeting}>
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
                  components={{ Toolbar: () => CustomToolbar({ selectedRowIds, fetchMeetingData }) }}
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

export default Meeting