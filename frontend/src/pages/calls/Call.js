/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
// @mui
import { Card, Button, Box, Container, Stack, Typography } from '@mui/material';
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
import AddCall from '../../components/call/Addcalls'
import { fetchCallData } from '../../redux/slice/callSlice';
import { useDispatch, useSelector } from 'react-redux';

// ----------------------------------------------------------------------
const CustomToolbar = ({ selectedRowIds, fetchCallData }) => {
  const [opendelete, setOpendelete] = useState(false);
  const dispatch = useDispatch()
  // open DeleteModel
  const handleCloseDelete = () => setOpendelete(false);
  const handleOpenDelete = () => setOpendelete(true);

  const deleteManyCalls = async (data) => {
    await deleteManyApi('call/deletemany', data)
    dispatch(fetchCallData());
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

const Call = () => {
  const [allCall, setAllCall] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [openCall, setOpenCall] = useState(false);
  const [userAction, setUserAction] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data, isLoading } = useSelector((state) => state?.callDetails)

  // open call model
  const handleOpenCall = () => setOpenCall(true);
  const handleCloseCall = () => setOpenCall(false);

  const userid = localStorage.getItem('user_id');
  const userRole = localStorage.getItem("userRole")

  const handleSelectionChange = (selectionModel) => {
    setSelectedRowIds(selectionModel);
  };

  const columns = [
    {
      field: "subject",
      headerName: "Subject",
      width: 250,
      cellClassName: "name-column--cell name-column--cell--capitalize",
      renderCell: (params) => {
        const handleFirstNameClick = () => {
          navigate(`/dashboard/call/view/${params.row._id}`)
        };

        return (
          <Box onClick={handleFirstNameClick}>
            {params.value}
          </Box>
        );
      }
    },
    {
      field: "startDateTime",
      headerName: "Start Date & Time",
      width: 250,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleString();
      },
    },

    { field: "duration", headerName: "Duration", headerAlign: "left", align: "left", width: 250 },
    { field: "status", headerName: "Status", headerAlign: "left", align: "left", width: 250 },
    {
      field: allCall.relatedTo === "Lead" ? "lead_id" : "contact_id",
      headerName: "Related To",
      cellClassName: "name-column--cell name-column--cell--capitalize",
      width: 250,
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
      width: 250,
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
    dispatch(fetchCallData());
  }, [userAction])

  return (
    <>
      {/* Add Calls */}
      <AddCall open={openCall} handleClose={handleCloseCall} setUserAction={setUserAction} />

      <Container maxWidth>
        <TableStyle>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4">
              Calls List
            </Typography>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenCall}>
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
                  components={{ Toolbar: () => CustomToolbar({ selectedRowIds, fetchCallData }) }}
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

export default Call