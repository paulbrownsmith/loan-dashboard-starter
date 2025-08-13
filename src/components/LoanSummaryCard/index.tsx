import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useLoanApplications } from '../../hooks/useLoanApplications';

interface LoanSummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

/**
 * Example component showing the expected component pattern
 * Candidates should create similar components for their implementation
 */
export const LoanSummaryCard: React.FC<LoanSummaryCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  color = 'primary',
}) => {
  const { loading } = useLoanApplications();
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography color="text.secondary" gutterBottom variant="overline">
          {title}
        </Typography>
        
        <Box display="flex" alignItems="center" gap={1}>
          {loading ? (
            <Skeleton variant="rectangular" sx={{ mb: 1, width: '100%', height: '2rem' }} />
          ) : (
            <Typography variant="h4" component="div" color={`${color}.main`}>
              {value}
            </Typography>
          )}
          {trend && (
            <>
              {trend === 'up' && <TrendingUpIcon color="success" />}
              {trend === 'down' && <TrendingDownIcon color="error" />}
            </>
          )}
        </Box>
        
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};