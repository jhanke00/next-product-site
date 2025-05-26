import { defer, lastValueFrom, retry, timer } from 'rxjs';

export function retryWithExponentialBackoffUtil<C extends () => Promise<any>>(params: {
  delay?: number;
  maxDelay?: number;
  retryCount?: number;
  callback: C;
  retryError?: (error: unknown) => void;
}): ReturnType<C> {
  const { callback, delay: baseDelay = 100, maxDelay = 500, retryCount = 3, retryError = () => {} } = params;

  const value = defer(callback).pipe(
    retry({
      count: retryCount,
      resetOnSuccess: true,
      delay: (error, i) => {
        retryError(error);

        // Calculate delay with exponential backoff: baseDelay * 2^retries
        const delay = Math.min(baseDelay * Math.pow(2, i - 1), maxDelay);

        // Add some jitter to avoid synchronized retries from multiple clients
        const jitter = delay * 0.1 * Math.random();

        const totalDelay = delay + jitter;

        return timer(totalDelay);
      },
    })
  );

  return lastValueFrom(value) as ReturnType<C>;
}
