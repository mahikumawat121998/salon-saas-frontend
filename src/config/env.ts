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

let parsedPublicEnv;
try {
  parsedPublicEnv = publicEnvSchema.parse({
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'SalonOS',
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
  });
} catch (e) {
  console.error("Failed to parse public env variables!", e);
  parsedPublicEnv = {
    apiUrl: 'http://localhost:3000/api',
    appUrl: 'http://localhost:3001',
    appName: 'SalonOS',
    isDev: false,
    isProd: true,
  };
}

let parsedServerEnv;
try {
  parsedServerEnv = serverEnvSchema.parse({
    nodeEnv: process.env.NODE_ENV || 'development',
  });
} catch (e) {
  parsedServerEnv = { nodeEnv: 'development' };
}

export const publicEnv = parsedPublicEnv;
export const serverEnv = parsedServerEnv;

export const env = {
  ...publicEnv,
  ...serverEnv,
};
