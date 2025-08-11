import React from 'react'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel,
  Box, FormControl, InputLabel, Select, MenuItem, TextField, Button
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select';
import ApplicationDetailDialog from '../ApplicationDetailDialog'

interface DataTableProps {
  columns: { label: string; key: string }[]
  rows: Record<string, any>[]
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

const DataTable: React.FC<DataTableProps> = ({ columns, rows }) => {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<string>('')
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL')
  const [search, setSearch] = React.useState<string>('')
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10)
  const [selected, setSelected] = React.useState<any | null>(null)
  const [modalOpen, setModalOpen] = React.useState(false)

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
            onChange={handleStatusChange}
          >
            {statusOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size="small"
          label="Search by Applicant Name"
          value={search}
          onChange={handleSearchChange}
          sx={{ minWidth: 250 }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rows</InputLabel>
          <Select
            label="Rows"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
          >
            {[5, 10, 20].map(num => (
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
              <TableCell>Actions</TableCell>
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
                    <TableCell key={col.key}>{row[col.key]}</TableCell>
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

      {/* Use the extracted dialog */}
      <ApplicationDetailDialog
        open={modalOpen}
        onClose={handleCloseModal}
        application={selected}
        calculateMonthlyPayment={calculateMonthlyPayment}
      />
    </Box>
  )
}

export default DataTable