'use client';

import Box from '@mui/material/Box';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import React from 'react';

export interface DataTableProps extends DataGridProps {
  height?: number | string;
}

export function DataTable({ height = 500, sx, ...props }: DataTableProps) {
  return (
    <Box
      sx={{
        height,
        width: '100%',
        '& .MuiDataGrid-root': {
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: 'background.paper',
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? '#F8FAFC' : '#1E293B',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          fontWeight: 600,
        },
        '& .MuiDataGrid-cell': {
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        },
        '& .MuiDataGrid-row:hover': {
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? 'rgba(124, 58, 237, 0.04)'
              : 'rgba(139, 92, 246, 0.08)',
        },
        ...sx,
      }}
    >
      <DataGrid disableRowSelectionOnClick {...props} />
    </Box>
  );
}
