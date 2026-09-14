'use client';

import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

export interface TableRowSkeletonProps {
  columns: number;
  rows?: number;
  hasAvatar?: boolean;
}

export function TableRowSkeleton({ columns, rows = 5, hasAvatar = false }: TableRowSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              {colIndex === 0 && hasAvatar ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Skeleton variant="circular" width={36} height={36} animation="wave" />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="80%" animation="wave" />
                    <Skeleton variant="text" width="40%" height={12} animation="wave" />
                  </Box>
                </Box>
              ) : (
                <Skeleton variant="text" width={colIndex === columns - 1 ? '40%' : '80%'} animation="wave" sx={{ ml: colIndex === columns - 1 ? 'auto' : 0 }} />
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export default TableRowSkeleton;
