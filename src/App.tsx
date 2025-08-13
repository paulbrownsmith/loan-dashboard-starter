// src/App.tsx
import React from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  Alert, 
  Paper
} from '@mui/material'
import { ApplicationsDataTable, RoleSwitcher, SummaryCards } from './components'
import { useAuth } from './contexts/AuthContext'
import { useLoanApplications } from './hooks/useLoanApplications'

function App() {
  const { currentUser } = useAuth()
  const { applications } = useLoanApplications() // Make sure your hook returns loading

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

        {/* Summary Cards Component */}
        <Paper sx={{ p: 3, backgroundColor: '#fafafa', marginBottom: '2rem' }}>
          <SummaryCards
            totalApplications={totalApplications}
            pendingCount={pendingCount}
            approvedToday={approvedToday}
            totalValue={totalValue}
          />
        </Paper>
        
        {/* Applications table */}
        <Paper sx={{ p: 3, minHeight: 400, backgroundColor: '#fafafa' }}>
          <Typography variant="h6" gutterBottom sx={{ marginBottom: '2rem'}}>
            Customer Applications
          </Typography>
          <ApplicationsDataTable columns={[
            { label: 'Applicant Name', key: 'applicantName' },
            { label: 'Loan Amount', key: 'amount' },
            { label: 'Risk Score', key: 'riskScore' },
            { label: 'Status', key: 'status' },
            { label: 'Submitted At', key: 'submittedAt' },
            { label: 'Actions', key: 'actions' }
          ]} currentUserRole={currentUser.role} />          
        </Paper>
      </Box>
    </Container>
  )
}

export default App