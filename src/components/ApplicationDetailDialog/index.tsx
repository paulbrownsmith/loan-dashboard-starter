import React, { useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab
} from '@mui/material'

interface ApplicationDetailDialogProps {
  open: boolean
  onClose: () => void
  application: any | null
  calculateMonthlyPayment: (amount: number, termMonths: number) => string
  currentUserRole?: string
}

function getRiskColor(score: number) {
  if (score <= 3) return 'success.main'
  if (score <= 7) return 'warning.main'
  return 'error.main'
}

export const ApplicationDetailDialog: React.FC<ApplicationDetailDialogProps> = ({
  open,
  onClose,
  application,
  calculateMonthlyPayment,
  currentUserRole
}) => {
  const [tab, setTab] = React.useState(0)

  // Always reset tab to 0 when dialog opens or user role changes
  useEffect(() => {
    if (open) setTab(0)
  }, [open, currentUserRole])

  if (!application) return null

  console.log('currentUserRole:', currentUserRole);

  const riskScore = application.riskScore ?? 0
  const riskBreakdown = application.riskBreakdown ?? []

  // Always use the latest currentUserRole for sensitive fields
  const isSenior = currentUserRole === 'SENIOR_OFFICER'
  const niNumber = isSenior ? application.nationalInsurance.value : application.nationalInsurance.masked
  const dob = isSenior ? application.dateOfBirth.value : application.dateOfBirth.masked
  const bankAccount = isSenior
    ? application.bankDetails?.value
    : application.bankDetails?.masked

  const infoFields = [
    { label: 'Name', value: application.applicantName },
    { label: 'Email', value: application.email },
    { label: 'Phone', value: application.phone },
    { label: 'Loan Amount', value: `£${application.amount?.toLocaleString('en-GB')}` },
    { label: 'Purpose', value: application.purpose },
    { label: 'Term Length', value: `${application.termMonths} months` },
    { label: 'Monthly Payment', value: `£${calculateMonthlyPayment(application.amount, application.termMonths)}` },
    { label: 'National Insurance Number', value: niNumber },
    { label: 'Date of Birth', value: dob },
    { label: 'Bank Account Details', value: bankAccount },
  ]

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Applicant Details</DialogTitle>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="Basic Information" />
        <Tab label="Financial Information" />
      </Tabs>
      <DialogContent dividers>
        {tab === 0 && (
          <Box>
            {infoFields.map(field => (
              <Typography variant="body2" gutterBottom sx={{ fontWeight: 700 }} key={field.label}>
                <Box component="span" sx={{ fontWeight: 700 }}>{field.label}:</Box>{' '}
                <Box component="span" sx={{ fontWeight: 400 }}>{field.value}</Box>
              </Typography>
            ))}
          </Box>
        )}
        {tab === 1 && (
          <Box>
            <Typography variant="body2" gutterBottom>
              <Box component="span" sx={{ fontWeight: 700 }}>Annual Income:</Box> £{application.annualIncome?.toLocaleString('en-GB') ?? '—'}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <Box component="span" sx={{ fontWeight: 700 }}>Credit Score:</Box> {application.creditScore ?? '—'}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <Box component="span" sx={{ fontWeight: 700 }}>Debt-to-Income Ratio:</Box> {application.dtiRatio ?? '—'}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <Box component="span" sx={{ fontWeight: 700 }}>Employment Status:</Box> {application.employmentStatus ?? '—'}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <Box component="span" sx={{ fontWeight: 700 }}>Risk Score:</Box>{' '}
              <Box component="span" sx={{ color: getRiskColor(riskScore), fontWeight: 600 }}>
                {riskScore}
              </Box>
            </Typography>
            <Box mt={1}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 700 }}>
                Risk Score Breakdown:
              </Typography>
              {Array.isArray(riskBreakdown) && riskBreakdown.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {riskBreakdown.map((item: string, idx: number) => (
                    <li key={idx}>
                      <Typography variant="body2">{item}</Typography>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No breakdown available.
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
