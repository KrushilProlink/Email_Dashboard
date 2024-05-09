/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { DeleteOutline } from '@mui/icons-material';
import { Box, Button, Card, Container, Stack, Typography } from '@mui/material';
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DeleteModel from '../../components/Deletemodle';
import TableStyle from '../../components/TableStyle';
import Iconify from '../../components/iconify';
import { fetchPolicyData } from '../../redux/slice/policySlice';
import { deleteManyApi } from '../../service/api';
import AddPolicy from './Add';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

function CustomToolbar({ selectedRowIds, fetchPolicyData }) {
  const [opendelete, setOpendelete] = useState(false);
  const dispatch = useDispatch()

  const handleCloseDelete = () => {
    setOpendelete(false)
  }

  const handleOpenDelete = () => {
    setOpendelete(true)
  }

  const deleteManyContact = async (data) => {
    await deleteManyApi('policy/deletemany', data)
    dispatch(fetchPolicyData())
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


const Policy = () => {

  const [policyList, setPolicyList] = useState([]);
  const [userAction, setUserAction] = useState(null)
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userid = localStorage.getItem('user_id')
  const userRole = localStorage.getItem("userRole")
  const { data, isLoading } = useSelector((state) => state?.policyDetails)
  // open add model
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleSelectionChange = (selectionModel) => {
    setSelectedRowIds(selectionModel);
  };


  const columns = [
    {
      field: "policyNumber",
      headerName: "Policy Number",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
        const handleFirstNameClick = () => {
          navigate(`/dashboard/policy/view/${params.id}`)
        };

        return (
          <Box onClick={handleFirstNameClick}>
            {params.value}
          </Box>
        );
      }
    },
    {
      field: "policyType",
      headerName: "Policy Type",
      flex: 1,
    },
    {
      field: "policyStartDate",
      headerName: "Policy start date",
      flex: 1,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toDateString();
      },
    },
    {
      field: "policyEndDate",
      headerName: "Policy end date",
      flex: 1,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toDateString();
      },
    },
    {
      field: "policyStatus",
      headerName: "Policy status",
      flex: 1,
    }
  ];


  useEffect(() => {
    dispatch(fetchPolicyData());
  }, [userAction])

  return (
    <>
      {/* Add Lead Model */}
      <AddPolicy open={openAdd} handleClose={handleCloseAdd} setUserAction={setUserAction} />

      <Container maxWidth>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" >
            Policy
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
                  components={{ Toolbar: () => CustomToolbar({ selectedRowIds, fetchPolicyData }) }}
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

export default Policy