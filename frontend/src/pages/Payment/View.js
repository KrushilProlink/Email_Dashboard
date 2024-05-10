/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Box, Container, Grid, Stack, Tab, Tabs } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CustomTabPanel, a11yProps } from '../../components/CustomTabPanel';
import Header from '../../components/Header';
import { apiget } from '../../service/api';
import Other from './Other';
import Overview from './Overview';

const View = () => {

    const [paymentDetails, setPaymentDetails] = useState({});
    const [openAdd, setOpenAdd] = useState(false);
    const [value, setValue] = useState(0);
    const navigate = useNavigate()
    const params = useParams()

    // tab
    const handleChange = (event, newValue) => setValue(newValue);

    const back = () => {
        navigate('/dashboard/payment')
    }

    // fetch api
    const fetchdata = async () => {
        const result = await apiget(`payment/view/${params.id}`)
        if (result && result.status === 200) {
            setPaymentDetails(result.data.paymentData)
        }
    }

    useEffect(() => {
        fetchdata();
    }, [openAdd])

    return (
        <div>
            <Container maxWidth>
                <Grid container display="flex" alignItems="center">
                    <Stack direction="row" alignItems="center" mb={3} justifyContent={"space-between"} width={"100%"}>
                        <Header
                            title={`${paymentDetails?.firstName} ${paymentDetails?.lastName}`}
                            subtitle="Payment Details"
                        />
                    </Stack>
                </Grid>

                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: "0px" }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="OVERVIEW" {...a11yProps(0)} />
                            <Tab label="OTHER" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <Overview data={paymentDetails} />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <Other data={paymentDetails} />
                    </CustomTabPanel>
                </Box>
            </Container>
        </div>
    )
}

export default View
