import { Shadows } from '@mui/material/styles';

export const lightShadows: Shadows = [
  'none',
  '0px 1px 2px 0px rgba(15, 23, 42, 0.05)',
  '0px 1px 3px 0px rgba(15, 23, 42, 0.1), 0px 1px 2px -1px rgba(15, 23, 42, 0.1)',
  '0px 4px 6px -1px rgba(15, 23, 42, 0.1), 0px 2px 4px -2px rgba(15, 23, 42, 0.1)',
  '0px 10px 15px -3px rgba(15, 23, 42, 0.1), 0px 4px 6px -4px rgba(15, 23, 42, 0.1)',
  '0px 20px 25px -5px rgba(15, 23, 42, 0.1), 0px 8px 10px -6px rgba(15, 23, 42, 0.1)',
  '0px 25px 50px -12px rgba(15, 23, 42, 0.25)',
  ...Array(18).fill('0px 10px 15px -3px rgba(15, 23, 42, 0.08)'),
] as unknown as Shadows;

export const darkShadows: Shadows = [
  'none',
  '0px 1px 2px 0px rgba(0, 0, 0, 0.3)',
  '0px 1px 3px 0px rgba(0, 0, 0, 0.4), 0px 1px 2px -1px rgba(0, 0, 0, 0.4)',
  '0px 4px 6px -1px rgba(0, 0, 0, 0.4), 0px 2px 4px -2px rgba(0, 0, 0, 0.4)',
  '0px 10px 15px -3px rgba(0, 0, 0, 0.4), 0px 4px 6px -4px rgba(0, 0, 0, 0.4)',
  '0px 20px 25px -5px rgba(0, 0, 0, 0.4), 0px 8px 10px -6px rgba(0, 0, 0, 0.4)',
  '0px 25px 50px -12px rgba(0, 0, 0, 0.6)',
  ...Array(18).fill('0px 10px 15px -3px rgba(0, 0, 0, 0.5)'),
] as unknown as Shadows;
