import React from 'react'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel,
  Box, FormControl, InputLabel, Select, MenuItem, TextField, Button, Chip, Typography
} from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import type { SelectChangeEvent } from '@mui/material/Select';
import { useLoanApplications } from '../../hooks/useLoanApplications'
import { ApplicationDetailDialog } from '../../components';
import { UserRole } from '../../types'

interface DataTableProps {
  columns: { label: string; key: string }[]
  currentUserRole: UserRole
}

type Order = 'asc' | 'desc'

const sortableKeys = ['applicantName', 'amount', 'riskScore']
const statusOptions = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Under Review', value: 'UNDER_REVIEW' }
]

function getComparator(order: Order, orderBy: string) {
  return (a: any, b: any) => {
    if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1
    if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1
    return 0
  }
}

// Helper for monthly payment calculation (simple annuity formula)
function calculateMonthlyPayment(amount: number, termMonths: number, annualRate = 0.06) {
  if (!amount || !termMonths) return '-'
  const monthlyRate = annualRate / 12
  return (
    (amount * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -termMonths))
  ).toFixed(2)
}

const getStatusChipColour = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return 'success'
    case 'PENDING':
      return 'info'
    case 'REJECTED':
      return 'error'
    case 'UNDER_REVIEW':
      return 'warning'
    default:
      return 'default'
  }
}

function getRiskColor(score: number) {
  if (score <= 3) return 'success.main'   // Green
  if (score <= 7) return 'warning.main'   // Amber
  return 'error.main'                     // Red
}

function getRiskLabel(score: number) {
  if (score <= 3) return 'LOW'
  if (score <= 7) return 'MEDIUM'
  return 'HIGH'
}

export const DataTable: React.FC<DataTableProps> = ({ columns, currentUserRole }) => {
  const [selected, setSelected] = React.useState<any | null>(null)
  const [modalOpen, setModalOpen] = React.useState(false)
  const { applications: rows } = useLoanApplications()
  const [searchParams, setSearchParams] = useSearchParams()
  const [order, setOrder] = React.useState<Order>(
  (searchParams.get('order') as Order) || 'asc'
  )
  const [orderBy, setOrderBy] = React.useState<string>(
    searchParams.get('orderBy') || ''
  )
  const [statusFilter, setStatusFilter] = React.useState<string>(
    searchParams.get('status') || 'ALL'
  )
  const [search, setSearch] = React.useState<string>(
    searchParams.get('search') || ''
  )
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(
    Number(searchParams.get('rowsPerPage')) || 10
  )

  // Update query string when state changes
  React.useEffect(() => {
    setSearchParams({
      order,
      orderBy,
      status: statusFilter,
      search,
      rowsPerPage: String(rowsPerPage),
    })
  }, [order, orderBy, statusFilter, search, rowsPerPage, setSearchParams])

  const handleSort = (key: string) => {
    if (orderBy === key) {
      setOrder(order === 'asc' ? 'desc' : 'asc')
    } else {
      setOrderBy(key)
      setOrder('asc')
    }
  }

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value as string)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value))
  }

  const handleViewDetails = (row: any) => {
    setSelected(row)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelected(null)
  }

  const filteredRows = React.useMemo(() => {
    let result = rows
    if (statusFilter !== 'ALL') {
      result = result.filter(row => row.status === statusFilter)
    }
    if (search.trim()) {
      result = result.filter(row =>
        row.applicantName?.toLowerCase().includes(search.trim().toLowerCase())
      )
    }
    return result
  }, [rows, statusFilter, search])

  const sortedRows = React.useMemo(() => {
    if (!orderBy || !sortableKeys.includes(orderBy)) return filteredRows
    return [...filteredRows].sort(getComparator(order, orderBy))
  }, [filteredRows, order, orderBy])

  const pagedRows = sortedRows.slice(0, rowsPerPage)

  return (
    <Box>
      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
        label="Filter by Status"
        value={statusFilter}
        onChange={handleStatusChange as (event: SelectChangeEvent<string>) => void}
          >
        {statusOptions.map((opt: { label: string; value: string }) => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
          </Select>
        </FormControl>
        <TextField
          size="small"
          label="Search by Applicant Name"
          value={search}
          onChange={handleSearchChange as React.ChangeEventHandler<HTMLInputElement>}
          sx={{ minWidth: 250 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rows</InputLabel>
          <Select
        label="Rows"
        value={rowsPerPage}
        onChange={handleRowsPerPageChange as (event: SelectChangeEvent<number>) => void}
          >
        {[5, 10, 20].map((num: number) => (
          <MenuItem key={num} value={num}>{num} rows</MenuItem>
        ))}
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={col.key}>
                  {sortableKeys.includes(col.key) ? (
                    <TableSortLabel
                      active={orderBy === col.key}
                      direction={orderBy === col.key ? order : 'asc'}
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              pagedRows.map((row, idx) => (
                <TableRow key={idx}>
                  {columns.map(col => (
                    <TableCell key={col.key}>
                      {col.key === 'status' ? (
                        <Chip
                          label={row.status}
                          color={getStatusChipColour(row.status)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                          variant="outlined"
                        />
                      ) : col.key === 'riskScore' ? (
                        <Typography variant="body2" gutterBottom>
                          <Box
                            component="span"
                            sx={{
                              color: getRiskColor(row.riskScore),
                              fontWeight: 700,
                              ml: 1,
                            }}
                          >
                            {row.riskScore} ({getRiskLabel(row.riskScore)})
                          </Box>
                        </Typography>
                      ) : (
                        String(row[col.key as keyof typeof row] ?? '')
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button size="small" onClick={() => handleViewDetails(row)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ApplicationDetailDialog
        open={modalOpen}
        onClose={handleCloseModal}
        application={selected}
        calculateMonthlyPayment={calculateMonthlyPayment}
        currentUserRole={currentUserRole}
      />
    </Box>
  )
}
