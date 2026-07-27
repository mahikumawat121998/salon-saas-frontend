'use client';

import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { ErrorTemplate } from './ErrorTemplate';

export function Forbidden() {
  return (
    <ErrorTemplate
      code="403"
      title="Access Denied"
      description="You don't have permission to access this page."
      icon={
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldAlert size={96} style={{ position: 'relative', color: '#6D28D9', fill: '#E9D5FF' }} />
        </div>
      }
      primaryAction={{ label: 'Go Back', onClick: () => window.history.back() }}
      secondaryAction={{ label: 'Go Home', href: '/' }}
    />
  );
}

export default Forbidden;
