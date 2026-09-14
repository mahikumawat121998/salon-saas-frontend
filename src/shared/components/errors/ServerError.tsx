'use client';

import React from 'react';
import { Bot } from 'lucide-react';
import { ErrorTemplate } from './ErrorTemplate';

export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorTemplate
      code="500"
      title="Internal Server Error"
      description="Something went wrong on our end. Our team has been notified."
      icon={
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: '90%', height: '70%', backgroundColor: '#F3E8FF', borderRadius: '16px' }} />
          <Bot size={72} style={{ position: 'relative', color: '#6D28D9', fill: '#E9D5FF' }} />
        </div>
      }
      primaryAction={{ label: 'Try Again', onClick: onRetry || (() => window.location.reload()) }}
      secondaryAction={{ label: 'Go Home', href: '/' }}
    />
  );
}

export default ServerError;
