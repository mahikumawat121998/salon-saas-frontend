'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import { ErrorTemplate } from './ErrorTemplate';

export function Unauthorized() {
  return (
    <ErrorTemplate
      code="401"
      title="Authentication Required"
      description="You need to login to access this resource."
      icon={
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: '80%', height: '80%', backgroundColor: '#F3E8FF', borderRadius: '24px' }} />
          <Lock size={64} style={{ position: 'relative', color: '#6D28D9' }} />
        </div>
      }
      primaryAction={{ label: 'Go to Login', href: '/login' }}
      secondaryAction={{ label: 'Go Home', href: '/' }}
    />
  );
}

export default Unauthorized;
