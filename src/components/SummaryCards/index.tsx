import React from 'react'
import { Box, Typography, Grid } from '@mui/material'
import { LoanSummaryCard } from '../'
import { formatCurrency } from '../../utils/formatting'

interface SummaryCardsProps {
  totalApplications: number
  pendingCount: number
  approvedToday: number
  totalValue: number
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalApplications,
  pendingCount,
  approvedToday,
  totalValue,
}) => (
  <Box mb={3}>
    <Typography variant="h6" gutterBottom>
      Summary Statistics
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <LoanSummaryCard
          title="Total Applications"
          value={totalApplications}
          subtitle="All time"
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <LoanSummaryCard
          title="Pending Review"
          value={pendingCount}
          subtitle="Requires action"
          color="warning"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <LoanSummaryCard
          title="Approved Today"
          value={approvedToday}
          subtitle="Processed today"
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <LoanSummaryCard
          title="Total Value"
          value={formatCurrency(totalValue)}
          subtitle="All applications"
          color="secondary"
        />
      </Grid>
    </Grid>
  </Box>
)