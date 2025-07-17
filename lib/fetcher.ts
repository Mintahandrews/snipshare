import { useStore } from "./store";

// Configurable retry options
const DEFAULT_RETRY_COUNT = 2;
const RETRY_DELAY_MS = 1000;

export async function fetcher(
  url: RequestInfo,
  init?: RequestInit,
  retryCount: number = DEFAULT_RETRY_COUNT
): Promise<any> {
  const update = useStore.getState().update;

  // Track retry attempts
  let currentRetry = 0;
  let lastError: Error | null = null;

  // Try multiple times if configured
  while (currentRetry <= retryCount) {
    try {
      // Check for network connectivity
      if (!navigator.onLine) {
        update("message", "OFFLINE");
        throw new Error("OFFLINE");
      }

      // Show loading indicator on first attempt
      if (currentRetry === 0) {
        update("message", "LOADING");
      } else {
        update("message", `RETRYING_REQUEST`);
      }

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        ...init,
      });

      // Handle no response or network error
      if (!res) {
        const errorMsg = "NETWORK_ERROR";
        update("message", errorMsg);
        throw new Error(errorMsg);
      }

      // Handle rate limiting with retry
      if (res.status === 429) {
        const errorMsg = "TOO_MANY_REQUESTS";
        update("message", errorMsg);

        // If we have retries left, wait and try again
        if (currentRetry < retryCount) {
          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_DELAY_MS * (currentRetry + 1))
          );
          currentRetry++;
          continue;
        }

        throw new Error(errorMsg);
      }

      // Try to parse JSON
      let body;
      try {
        body = await res.json();
      } catch (e) {
        const errorMsg = "INVALID_RESPONSE";
        update("message", errorMsg);
        throw new Error(errorMsg);
      }

      if (!res.ok) {
        const { code } = body;

        if (!code) {
          const errorMsg = "UNKNOWN_ERROR";
          update("message", errorMsg);
          throw new Error(errorMsg);
        }

        update("message", code);
        throw new Error(code);
      }

      // Clear any error message on success
      update("message", "");
      return body;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // If it's a network error or timeout and we have retries left, try again
      if (
        currentRetry < retryCount &&
        (lastError.message === "NETWORK_ERROR" ||
          lastError.message === "TIMEOUT_ERROR" ||
          lastError.message === "FAILED_TO_FETCH")
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY_MS * (currentRetry + 1))
        );
        currentRetry++;
      } else {
        // If it's already a handled error or we're out of retries, rethrow it
        throw lastError;
      }
    }
  }

  // This shouldn't happen due to our throw in the catch block,
  // but TypeScript needs a return statement
  throw lastError || new Error("UNEXPECTED_ERROR");
}

// Function to abort a fetch after a timeout
export function fetchWithTimeout(
  url: RequestInfo,
  options?: RequestInit,
  timeoutMs: number = 10000
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const { signal } = controller;

    const timeout = setTimeout(() => {
      controller.abort();
      reject(new Error("TIMEOUT_ERROR"));
    }, timeoutMs);

    fetch(url, { ...options, signal })
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeout));
  });
}
