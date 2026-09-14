'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { FileText, RefreshCw, ShieldAlert, KeyRound, Ban, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminApiService } from '@/services/api/admin.service';
import { QUERY_KEYS } from '@/config/query-keys';

const getActionConfig = (action: string) => {
  switch (action) {
    case 'TENANT_IMPERSONATION':
      return { label: 'Impersonation Access', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)', icon: KeyRound };
    case 'TENANT_SUSPENDED':
      return { label: 'Tenant Suspended', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', icon: Ban };
    case 'TENANT_ACTIVATED':
      return { label: 'Tenant Activated', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', icon: CheckCircle2 };
    default:
      return { label: action, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)', icon: ShieldAlert };
  }
};

export default function AuditLogsPage() {
  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: QUERY_KEYS.admin.auditLogs,
    queryFn: () => adminApiService.getAuditLogs(),
  });

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em' }}>
            System Audit Logs
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Security trail of Super Admin actions, impersonation support sessions, and tenant lifecycle changes
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshCw size={16} />}
          onClick={() => refetch()}
          sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
        >
          Refresh Logs
        </Button>
      </Box>

      <Card
        sx={{
          borderRadius: '24px',
          border: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'),
          backgroundColor: (t) => (t.palette.mode === 'dark' ? '#151E2E' : '#FFFFFF'),
          p: 3,
        }}
      >
        <TableContainer>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ '& th': { borderBottom: (t) => (t.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #F1F5F9') } }}>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.78rem' }}>Timestamp</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.78rem' }}>Action Type</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.78rem' }}>Target Tenant ID</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.78rem' }}>Reason / Details</TableCell>
                <TableCell sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.78rem' }}>Actor ID</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton animation="wave" width={140} height={20} /></TableCell>
                    <TableCell><Skeleton animation="wave" width={120} height={24} sx={{ borderRadius: '12px' }} /></TableCell>
                    <TableCell><Skeleton animation="wave" width={100} height={20} /></TableCell>
                    <TableCell><Skeleton animation="wave" width={200} height={20} /></TableCell>
                    <TableCell><Skeleton animation="wave" width={90} height={20} /></TableCell>
                  </TableRow>
                ))
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No audit logs recorded yet.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => {
                  const cfg = getActionConfig(log.action);
                  const Icon = cfg.icon;
                  return (
                    <TableRow key={log.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                      <TableCell sx={{ fontSize: '0.78125rem', fontWeight: 600, color: 'text.secondary' }}>
                        {new Date(log.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </TableCell>

                      <TableCell>
                        <Chip
                          icon={<Icon size={13} style={{ color: cfg.color }} />}
                          label={cfg.label}
                          size="small"
                          sx={{
                            fontWeight: 800,
                            fontSize: '0.68rem',
                            backgroundColor: cfg.bg,
                            color: cfg.color,
                            borderRadius: '6px',
                          }}
                        />
                      </TableCell>

                      <TableCell sx={{ fontSize: '0.78125rem', fontWeight: 700, color: 'text.primary' }}>
                        {log.targetTenantId ? `${log.targetTenantId.slice(0, 12)}...` : 'N/A'}
                      </TableCell>

                      <TableCell sx={{ fontSize: '0.8125rem', color: 'text.primary', fontWeight: 500 }}>
                        {log.reason || log.details || 'System operation'}
                      </TableCell>

                      <TableCell sx={{ fontSize: '0.72rem', color: 'text.secondary', fontFamily: 'monospace' }}>
                        {log.actorUserId.slice(0, 10)}...
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
