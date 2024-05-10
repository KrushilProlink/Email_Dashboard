/* eslint-disable react/prop-types */
import { Box, Card, Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import Palette from '../../theme/palette'

const Overview = ({ data, setUserAction }) => {

  return (
    <div>
      <Card style={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px" }}>
        <Box p={3}>
          <Grid container display="flex" spacing={4}>
            <Grid item xs={12} sm={6}>
              <Grid style={{ borderBottom: "1.5px dashed", borderBottomColor: Palette.grey[400] }} pb={2}>
                <Typography variant="body1">First Name :</Typography>
                <Typography variant="body2" color={Palette.grey[600]} textTransform={"capitalize"}>{`${data?.firstName}`}</Typography>
              </Grid>
              <Grid style={{ borderBottom: "1.5px dashed", borderBottomColor: Palette.grey[400] }} py={2}>
                <Typography variant="body1">Last Name :</Typography>
                <Typography variant="body2" color={Palette.grey[600]} textTransform={"capitalize"}>{`${data?.lastName}`}</Typography>
              </Grid>
              <Grid style={{ borderBottom: "1.5px dashed", borderBottomColor: Palette.grey[400] }} py={2}>
                <Typography variant="body1">Account Number :</Typography>
                <Typography variant="body2" color={Palette.grey[600]}>{data?.accountNo}</Typography>
              </Grid>
              <Grid style={{ borderBottom: "1.5px dashed", borderBottomColor: Palette.grey[400] }} py={2}>
                <Typography variant="body1">Checkout Request Id :</Typography>
                <Typography variant="body2" color={Palette.grey[600]}>{data?.checkoutRequestId ? data?.checkoutRequestId : "null"}</Typography>
              </Grid>
              <Grid style={{ borderBottom: "1.5px dashed", borderBottomColor: Palette.grey[400] }} py={2}>
                <Typography variant="body1">Phone Number:</Typography>
                <Typography variant="body2" color={Palette.grey[600]}>{data?.senderPhoneNumber}</Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid style={{ borderBottom: "1.5px dashed", borderBottomColor: Palette.grey[400] }} pb={2}>
                <Typography variant="body1">Customer Message:</Typography>
                <Typography variant="body2" color={Palette.grey[600]}>{data?.customerMessage ? data?.customerMessage : "null"}</Typography>
              </Grid>
              <Grid style={{ borderBottom: "1.5px dashed", borderBottomColor: Palette.grey[400] }} py={2}>
                <Typography variant="body1">Email :</Typography>
                <Typography variant="body2" color={Palette.primary.main} style={{ cursor: "pointer" }}>{data?.emailAddress ? data?.emailAddress : "null"}</Typography>
              </Grid>
              <Grid style={{ borderBottom: "1.5px dashed", borderBottomColor: Palette.grey[400] }} py={2}>
                <Typography variant="body1">Status :</Typography>
                <Typography variant="body2" color={Palette.grey[600]}>{data?.status}</Typography>
              </Grid>
              <Grid style={{ borderBottom: "1.5px dashed", borderBottomColor: Palette.grey[400] }} py={2}>
                <Typography variant="body1">Order Id :</Typography>
                <Typography variant="body2" color={Palette.grey[600]}>{data?.orderId}</Typography>
              </Grid>
              <Grid style={{ borderBottom: "1.5px dashed", borderBottomColor: Palette.grey[400] }} py={2}>
                <Typography variant="body1">Amount :</Typography>
                <Typography variant="body2" color={Palette.grey[600]}>{data?.amount}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </div>
  )
}

export default Overview
