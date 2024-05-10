/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
// @mui
import { Box, Button, Card, Container, Stack, Typography } from '@mui/material';
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
// components
import moment from "moment";
import TableStyle from '../../components/TableStyle';
import Iconify from '../../components/iconify';
import { apiget } from '../../service/api';
import MakeNewPayment from './Add';
// ----------------------------------------------------------------------

function CustomToolbar({ selectedRowIds, fetchdata }) {
    const [userAction, setUserAction] = useState(null);
    const userid = localStorage.getItem('user_id');

    useEffect(() => {
        setUserAction(userAction)
    }, [userAction])

    return (
        <GridToolbarContainer>
            <GridToolbar />
        </GridToolbarContainer>
    );
}

const Payment = () => {

    const [userAction, setUserAction] = useState(null);
    const [selectedRowIds, setSelectedRowIds] = useState([]);
    const [leadData, setLeadData] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const navigate = useNavigate();

    const userid = localStorage.getItem('user_id');
    const userRole = localStorage.getItem("userRole");

    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);

    const columns = [
        {
            field: "firstName",
            headerName: "First Name",
            flex: 1,
            cellClassName: "name-column--cell name-column--cell--capitalize",
            renderCell: (params) => {
                console.log(params);
                const handleFirstNameClick = () => {
                    navigate(`/dashboard/user/view/${params.row.createdBy?._id}`);
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
            cellClassName: "name-column--cell--capitalize",
        },
        {
            field: "emailAddress",
            headerName: "Email Address",
            flex: 1,
        },
        {
            field: "senderPhoneNumber",
            headerName: "Phone Number",
            flex: 1,
        },
        {
            field: "amount",
            headerName: "Amount",
            flex: 1,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
        },
        {
            field: "createdOn",
            headerName: "Transaction Date",
            flex: 1,
            renderCell: (params) => {
                return (
                    <>
                        {moment(params?.row?.createdOn).format('lll')}
                    </>
                );
            }
        }
    ];


    const fetchdata = async () => {
        const result = await apiget(userRole === "admin" ? `payment/list` : `payment/list/?createdBy=${userid}`)
        if (result && result.status === 200) {
            setLeadData(result?.data?.result)
        }
    }

    const handleSelectionChange = (selectionModel) => {
        setSelectedRowIds(selectionModel);
    };


    useEffect(() => {
        fetchdata();
    }, [openAdd, userAction])
    return (
        <>
            <MakeNewPayment open={openAdd} handleClose={handleCloseAdd} setUserAction={setUserAction} />

            <Container maxWidth>
                <Stack direction="row" alignItems="center" mb={5} justifyContent={"space-between"}>
                    <Typography variant="h4" >
                        Payment
                    </Typography>
                    <Stack direction="row" alignItems="center" justifyContent={"flex-end"} spacing={2}>
                        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
                            Make New Payment
                        </Button>
                    </Stack>
                </Stack>
                <TableStyle>
                    <Box width="100%">
                        <Card style={{ height: "600px", paddingTop: "15px" }}>
                            <DataGrid
                                rows={leadData}
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

export default Payment