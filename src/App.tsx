// src/App.tsx
import React from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  Alert, 
  Paper,
  Grid,
  Skeleton 
} from '@mui/material'
import { DataTable, LoanSummaryCard, RoleSwitcher } from './components'
import { useAuth } from './contexts/AuthContext'
import { useLoanApplications } from './hooks/useLoanApplications'
import { formatCurrency } from './utils/formatting'

function App() {
  const { currentUser } = useAuth()
  const { applications, loading } = useLoanApplications() // Make sure your hook returns loading

  // Calculate summary statistics
  const totalApplications = applications.length
  const pendingCount = applications.filter(app => app.status === 'PENDING').length
  const approvedToday = applications.filter(app => {
    const today = new Date().toDateString()
    return app.status === 'APPROVED' && 
           new Date(app.submittedAt).toDateString() === today
  }).length
  const totalValue = applications.reduce((sum, app) => sum + app.amount, 0)

  console.log('Applications:', applications);

  return (
    <Container maxWidth="xl">
      <Box py={3}>
        {/* Header */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={3}
        >
          <Typography variant="h4" component="h1">
            Loan Application Dashboard
          </Typography>
          <RoleSwitcher />
        </Box>
        
        {/* Role Alert */}
        <Alert severity="info" sx={{ mb: 3 }}>
          Current Role: <strong>{currentUser.role}</strong>
          {currentUser.role === 'LOAN_OFFICER' && 
            ' - Limited access to sensitive data'}
          {currentUser.role === 'SENIOR_OFFICER' && 
            ' - Full access to all data'}
        </Alert>

        {/* Example Summary Cards - Shows component usage pattern */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Summary Statistics (Example)
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

        {/* Placeholder for Implementation */}
        <Paper sx={{ p: 3, minHeight: 400, backgroundColor: '#fafafa' }}>
          <Typography variant="h6" gutterBottom>
            Application Table
          </Typography>
          {/* Show skeleton while loading, else DataTable */}
          {loading ? (
            <Box>
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} variant="rectangular" height={48} sx={{ mb: 1 }} />
              ))}
            </Box>
          ) : (
            <DataTable columns={[
              { label: 'Applicant Name', key: 'applicantName' },
              { label: 'Loan Amount', key: 'amount' },
              { label: 'Risk Score', key: 'riskScore' },
              { label: 'Status', key: 'status' },
              { label: 'Submitted At', key: 'submittedAt' },
              { label: 'Actions', key: 'actions' }
            ]} rows={applications} currentUserRole={currentUser.role} />
          )}
        </Paper>
      </Box>
    </Container>
  )
}

export default App