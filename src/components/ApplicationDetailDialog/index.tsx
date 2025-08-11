import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography
} from '@mui/material'

// You may want to import the correct LoanApplication type from your types file
interface ApplicationDetailDialogProps {
  open: boolean
  onClose: () => void
  application: any | null
  calculateMonthlyPayment: (amount: number, termMonths: number) => string
}

const ApplicationDetailDialog: React.FC<ApplicationDetailDialogProps> = ({
  open,
  onClose,
  application,
  calculateMonthlyPayment
}) => {
  if (!application) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Applicant Details</DialogTitle>
      <DialogContent dividers>
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            <strong>Name:</strong> {application.applicantName}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Email:</strong> {application.email}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Phone:</strong> {application.phone}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Loan Amount:</strong> £{application.amount?.toLocaleString('en-GB')}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Purpose:</strong> {application.purpose}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Term Length:</strong> {application.termMonths} months
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Monthly Payment:</strong> £{calculateMonthlyPayment(application.amount, application.termMonths)}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ApplicationDetailDialog;