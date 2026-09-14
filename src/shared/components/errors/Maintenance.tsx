'use client';

import React from 'react';
import { Settings } from 'lucide-react';
import { ErrorTemplate } from './ErrorTemplate';

export interface MaintenanceProps {
  message?: string;
  estimatedTime?: string;
}

export function Maintenance({ message, estimatedTime }: MaintenanceProps) {
  return (
    <ErrorTemplate
      code=""
      title="We're Under Maintenance"
      description={message || "We are currently performing scheduled maintenance. We'll be back online shortly!"}
      icon={
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: '25%', left: '10%', width: '80%', height: '50%', backgroundColor: '#F3E8FF', borderRadius: '12px' }} />
          <Settings size={64} style={{ position: 'absolute', bottom: '15%', left: '25%', color: '#6D28D9', fill: '#6D28D9' }} />
          {/* Construction barrier style */}
          <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '40%', height: '20%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ width: '100%', height: '40%', background: 'repeating-linear-gradient(45deg, #6D28D9, #6D28D9 10px, #E9D5FF 10px, #E9D5FF 20px)', borderRadius: '4px' }} />
            <div style={{ width: '100%', height: '40%', background: 'repeating-linear-gradient(45deg, #6D28D9, #6D28D9 10px, #E9D5FF 10px, #E9D5FF 20px)', borderRadius: '4px' }} />
          </div>
        </div>
      }
      extraContent={
        estimatedTime ? (
          <div style={{ backgroundColor: '#F9FAFB', padding: '12px 16px', borderRadius: '8px', textAlign: 'left', border: '1px solid #E5E7EB' }}>
            <span style={{ display: 'block', fontSize: '12px', color: '#6B7280', fontWeight: 600 }}>Estimated Time</span>
            <span style={{ display: 'block', fontSize: '14px', color: '#111827', fontWeight: 700 }}>{estimatedTime}</span>
          </div>
        ) : null
      }
      primaryAction={{ label: 'Notify Me When Ready', onClick: () => alert('You will be notified!') }}
    />
  );
}

export default Maintenance;
