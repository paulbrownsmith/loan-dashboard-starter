import { useState, useMemo, useEffect } from 'react'
import { ApplicationFilters, LoanApplication } from '../types'
import { mockApplications } from '../mocks/mockData'

export function useLoanApplications(initialFilters?: ApplicationFilters) {
  const [filters, setFilters] = useState<ApplicationFilters>(initialFilters || {})
  const [loading, setLoading] = useState<boolean>(true)
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setLoading(true)
    // Simulate async fetch
    const timeout = setTimeout(() => {
      try {
        let filtered = [...mockApplications]

        if (filters.status) {
          filtered = filtered.filter(app => app.status === filters.status)
        }

        if (filters.searchTerm) {
          const term = filters.searchTerm.toLowerCase()
          filtered = filtered.filter(app => 
            app.applicantName.toLowerCase().includes(term) ||
            app.email.toLowerCase().includes(term)
          )
        }

        if (filters.minAmount) {
          filtered = filtered.filter(app => app.amount >= filters.minAmount!)
        }

        if (filters.maxAmount) {
          filtered = filtered.filter(app => app.amount <= filters.maxAmount!)
        }

        setApplications(filtered)
        setError(null)
      } catch (e) {
        setError(e as Error)
      } finally {
        setLoading(false)
      }
    }, 1200) // Simulate network delay

    return () => clearTimeout(timeout)
  }, [filters])

  return {
    applications,
    loading,
    error,
    filters,
    setFilters,
  }
}