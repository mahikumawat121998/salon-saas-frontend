'use client';

import MuiSkeleton, { SkeletonProps as MuiSkeletonProps } from '@mui/material/Skeleton';
import React from 'react';

export type SkeletonProps = MuiSkeletonProps;

export function Skeleton(props: SkeletonProps) {
  return <MuiSkeleton animation="wave" {...props} />;
}
