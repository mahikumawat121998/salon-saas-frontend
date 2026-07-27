import { z } from 'zod';

const publicEnvSchema = z.object({
  apiUrl: z.string().url().default('http://localhost:3000/api'),
  appUrl: z.string().url().default('http://localhost:3001'),
  appName: z.string().default('SalonOS'),
  isDev: z.boolean().default(process.env.NODE_ENV === 'development'),
  isProd: z.boolean().default(process.env.NODE_ENV === 'production'),
});

const serverEnvSchema = z.object({
  nodeEnv: z.string().default('development'),
});

export const publicEnv = publicEnvSchema.parse({
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'SalonOS',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
});

export const serverEnv = serverEnvSchema.parse({
  nodeEnv: process.env.NODE_ENV || 'development',
});

export const env = {
  ...publicEnv,
  ...serverEnv,
};
