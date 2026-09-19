import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Scissors } from 'lucide-react';

export interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export function Logo({ size = 'medium', showText = true }: LogoProps) {
  const sizeMap = {
    small: { boxSize: 32, iconSize: 18, titleVariant: 'subtitle2', subVariant: 'caption' as const },
    medium: { boxSize: 40, iconSize: 22, titleVariant: 'h6', subVariant: 'caption' as const },
    large: { boxSize: 56, iconSize: 28, titleVariant: 'h4', subVariant: 'subtitle2' as const },
  };

  const { boxSize, iconSize, titleVariant, subVariant } = sizeMap[size];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: size === 'large' ? 2 : 1.5,
      }}
    >
      <Box
        sx={{
          color: '#7C3AED',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Scissors size={iconSize + 8} />
      </Box>
      
      {showText && (
        <Box>
          <Typography variant={titleVariant as any} sx={{ fontWeight: 800, lineHeight: 1.2 }}>
            SalonNO
          </Typography>
          <Typography variant={subVariant} color="text.secondary" sx={{ display: 'block', mt: 0.2 }}>
            Salon Management
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default Logo;
