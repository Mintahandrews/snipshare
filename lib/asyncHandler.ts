/**
 * Utility to safely handle asynchronous operations
 * This helps prevent "A listener indicated an asynchronous response by returning true,
 * but the message channel closed before a response was received" errors
 */

export const safeAsync = async <T>(
  asyncFn: () => Promise<T>,
  onSuccess?: (result: T) => void,
  onError?: (error: Error) => void,
  timeoutMs: number = 15000 // Increased default timeout for slower mobile connections
): Promise<T | undefined> => {
  try {
    // Check if device is mobile for potential optimizations
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ));

    // Adjust timeout based on device type
    const adjustedTimeout = isMobile
      ? Math.min(timeoutMs * 1.5, 30000)
      : timeoutMs;

    // Create a timeout promise to ensure we don't wait forever
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(
        () => reject(new Error("Operation timed out")),
        adjustedTimeout
      );
    });

    // Race the original promise with the timeout
    const result = (await Promise.race([asyncFn(), timeoutPromise])) as T;

    if (onSuccess) {
      onSuccess(result);
    }

    return result;
  } catch (error) {
    // More detailed error handling
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Create a standardized error object
    const standardError =
      error instanceof Error ? error : new Error(errorMessage);

    // Add additional context if available
    if (typeof window !== "undefined") {
      (standardError as any).deviceInfo = {
        width: window.innerWidth,
        height: window.innerHeight,
        online: navigator.onLine,
        userAgent: navigator.userAgent,
      };
    }

    if (onError) {
      onError(standardError);
    }

    console.error("Async operation failed:", standardError);
    return undefined;
  }
};

/**
 * Utility to debounce promises to prevent race conditions
 */
export const debouncePromise = <T>(
  fn: (...args: any[]) => Promise<T>,
  ms = 300
) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let latestResolve: ((value: T | undefined) => void) | null = null;
  let latestReject: ((reason?: any) => void) | null = null;

  return (...args: any[]): Promise<T | undefined> => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    return new Promise((resolve, reject) => {
      latestResolve = resolve;
      latestReject = reject;

      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args);
          if (latestResolve) latestResolve(result);
        } catch (error) {
          if (latestReject) latestReject(error);
        }
      }, ms);
    });
  };
};

/**
 * Utility to retry a promise-based operation with exponential backoff
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  retryCount: number = 3,
  initialDelayMs: number = 1000,
  backoffFactor: number = 1.5
): Promise<T> => {
  let currentDelay = initialDelayMs;
  let currentRetry = 0;
  let lastError: Error | null = null;

  while (currentRetry <= retryCount) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // If we've used all retries, throw the error
      if (currentRetry >= retryCount) {
        throw lastError;
      }

      // Wait with exponential backoff before retrying
      await new Promise((resolve) => setTimeout(resolve, currentDelay));

      // Increase the delay using the backoff factor
      currentDelay *= backoffFactor;
      currentRetry++;
    }
  }

  // This shouldn't happen due to our throw above, but TypeScript needs it
  throw lastError || new Error("Unknown error in retry operation");
};
