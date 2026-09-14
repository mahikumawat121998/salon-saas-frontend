'use client';

import React from 'react';

export interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  return <>{children}</>;
}

export default GuestGuard;
