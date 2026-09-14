'use client';

import { ServerError } from '@/shared/components/errors';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ServerError onRetry={reset} />;
}
