/* eslint-disable react/prop-types */
import { Box, Card, Grid, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Palette from '../../theme/palette'


// eslint-disable-next-line arrow-body-style
const Overview = ({ data, isLoading }) => {
  return (
    <div>
      {isLoading ? (
        <Card style={{ display: 'flex', justifyContent: 'center', paddingBottom: "70px" }}>
          <span className="loader" />
        </Card>
      ) : (
        <Card style={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px" }}>
          <Box p={3}>
            <Grid container display="flex" spacing={4}>
              <Grid item xs={12} sm={6}>
                <Grid style={{ borderBottom: "1.5px dashed", borderBottomColor: Palette.grey[400] }} pb={2}>
                  <Typography variant="body1">Sender :</Typography>
                  <Typography variant="body2" color={Palette.grey[600]} textTransform={"capitalize"}>{data?.senderName ? data?.senderName : "--"}</Typography>
                </Grid>
                <Grid style={{ borderBottom: "1.5px dashed", borderBottomColor: Palette.grey[400] }} py={2}>
                  <Typography variant="body1">Related To {data?.relatedTo === "Lead" ? 'Lead' : 'Contact'} :</Typography>
                  {
                    data?.relatedTo === "Lead" ?
                      <Link to={`/dashboard/lead/view/${data?.lead_id}`} style={{ textDecoration: "none" }}>
                        <Typography variant="body2" color={Palette.primary.main} textTransform={"capitalize"}>{`${data?.reciverName}`}</Typography>
                      </Link>
                      :
                      <Link to={`/dashboard/contact/view/${data?.contact_id}`} style={{ textDecoration: "none" }}>
                        <Typography variant="body2" color={Palette.primary.main} textTransform={"capitalize"}>{`${data?.reciverName}`}</Typography>
                      </Link>
                  }
                </Grid>
                <Grid style={{ borderBottom: "1.5px dashed", borderBottomColor: Palette.grey[400] }} py={2}>
                  <Typography variant="body1">Message :</Typography>
                  <Typography variant="body2" color={Palette.grey[600]} >{data?.message ? data?.message : "--"}</Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid style={{ borderBottom: "1.5px dashed", borderBottomColor: Palette.grey[400] }} pb={2}>
                  <Typography variant="body1">Reciver Number :</Typography>
                  <Typography variant="body2" color={Palette.grey[600]} >{data?.reciverNumber ? data?.reciverNumber : "--"}</Typography>
                </Grid>
                <Grid style={{ borderBottom: "1.5px dashed", borderBottomColor: Palette.grey[400] }} py={2}>
                  <Typography variant="body1">Status :</Typography>
                  <Typography variant="body2" color={Palette.grey[600]} >{data?.status ? data?.status : "--"}</Typography>
                </Grid>
                {data?.errorMessage && <Grid style={{ borderBottom: "1.5px dashed", borderBottomColor: Palette.grey[400] }} py={2}>
                  <Typography variant="body1">Error Message :</Typography>
                  <Typography variant="body2" color={Palette.grey[600]} >{data?.errorMessage ? data?.errorMessage : "--"}</Typography>
                </Grid>}
              </Grid>
            </Grid>
          </Box>
        </Card>
      )}

    </div >
  )
}

export default Overview
