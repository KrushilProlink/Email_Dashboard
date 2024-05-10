
import { Box, Button, Card, Container, Stack, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TableStyle from '../../components/TableStyle';
import Iconify from '../../components/iconify';
import { fetchUserData } from '../../redux/slice/userSlice';
import AddUser from './Add';
// ----------------------------------------------------------------------

const User = () => {

    const [allUser, setAllUser] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [userAction, setUserAction] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { data, isLoading } = useSelector((state) => state?.userDetails)

    const handleOpenAdd = () => setOpenAdd(true);
    const handleCloseAdd = () => setOpenAdd(false);

    const columns = [
        {
            field: "firstName",
            headerName: "First Name",
            width: 400,
            cellClassName: "name-column--cell name-column--cell--capitalize",
            renderCell: (params) => {
                const handleFirstNameClick = () => {
                    navigate(`/dashboard/user/view/${params.row._id}`)
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
            cellClassName: "name-column--cell--capitalize",
            width: 400,

        },
        {
            field: "emailAddress",
            headerName: "Email Address",
            width: 400,
        },
        {
            field: "role",
            headerName: "Role",
            cellClassName: "name-column--cell--capitalize",
            width: 300
        }
    ];

    useEffect(() => {
        dispatch(fetchUserData());
    }, [userAction])

    return (
        <>
            <AddUser open={openAdd} handleClose={handleCloseAdd} setUserAction={setUserAction} />

            <Container maxWidth>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4">
                        User
                    </Typography>
                    <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
                        Add New
                    </Button>
                </Stack>
                <TableStyle>
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
                                    components={{ Toolbar: GridToolbar }}
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

export default User