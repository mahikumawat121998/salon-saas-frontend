'use client';

import { Scissors } from 'lucide-react';
import React from 'react';

export interface FullScreenLoaderProps {
  message?: string;
}

export function FullScreenLoader({ message = 'Loading Salon Suite...' }: FullScreenLoaderProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'var(--initial-bg)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'var(--initial-loader-bg)',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sams-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes sams-dash { 0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; } 50% { stroke-dasharray: 90, 200; stroke-dashoffset: -35px; } 100% { stroke-dasharray: 90, 200; stroke-dashoffset: -124px; } }
      `}} />
      
      <div
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}
      >
        <svg width="72" height="72" viewBox="22 22 44 44" style={{ animation: 'sams-spin 1.4s linear infinite', color: '#7C3AED' }}>
          <circle cx="44" cy="44" r="20.2" fill="none" strokeWidth="3.6" stroke="currentColor" strokeDasharray="80px, 200px" strokeDashoffset="0" style={{ animation: 'sams-dash 1.4s ease-in-out infinite' }} />
        </svg>
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7C3AED',
          }}
        >
          <Scissors size={28} />
        </div>
      </div>

      <h6 style={{ margin: 0, fontWeight: 800, fontSize: '1.25rem', color: 'var(--initial-text)', fontFamily: 'var(--font-inter)' }}>
        SalonNO
      </h6>

      {message && (
        <p style={{ marginTop: '4px', marginBottom: 0, fontWeight: 500, fontSize: '0.875rem', color: 'var(--initial-text-secondary)', fontFamily: 'var(--font-inter)' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default FullScreenLoader;
