/**
 * Resilient API Client with exponential backoff, timeout guard, and offline fallback caching.
 */
import { circuitBreaker } from './circuitBreaker';
import { telemetry } from '../observability/telemetry';

const DEFAULT_TIMEOUT_MS = 10000;
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

export class ApiError extends Error {
  constructor(message, code = 'API_ERROR', status = 500, details = null) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Executes an async Supabase/API query with timeout, retry, and circuit breaker protection.
 * @param {string} serviceName - identifier for circuit breaking (e.g. 'supabase_db')
 * @param {Function} queryFn - function returning a Supabase promise
 * @param {Object} options - { timeoutMs, retries, fallbackData, cacheKey }
 */
export async function executeResilientQuery(serviceName, queryFn, options = {}) {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retries = MAX_RETRIES,
    fallbackData = null,
    cacheKey = null
  } = options;

  const startTime = performance.now();

  // 1. Check circuit breaker status
  if (!circuitBreaker.canExecute(serviceName)) {
    telemetry.recordCircuitBreak(serviceName);
    if (cacheKey) {
      const cached = getOfflineCache(cacheKey);
      if (cached) return { data: cached, isCached: true, degraded: true };
    }
    if (fallbackData !== null) return { data: fallbackData, isFallback: true, degraded: true };
    throw new ApiError(`Service ${serviceName} is currently degraded. Please try again shortly.`, 'CIRCUIT_OPEN', 503);
  }

  let attempt = 0;
  let lastError = null;

  while (attempt < retries) {
    attempt++;
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeoutMs);

    try {
      const result = await Promise.race([
        queryFn(abortController.signal),
        new Promise((_, reject) => {
          abortController.signal.addEventListener('abort', () => {
            reject(new ApiError(`Query timed out after ${timeoutMs}ms`, 'TIMEOUT', 504));
          });
        })
      ]);

      clearTimeout(timeoutId);

      // Check for Supabase returned error
      if (result && result.error) {
        throw new ApiError(result.error.message || 'Database query error', result.error.code || 'DB_ERROR', 400, result.error);
      }

      // Success: register with circuit breaker and telemetry
      const duration = performance.now() - startTime;
      circuitBreaker.recordSuccess(serviceName);
      telemetry.recordApiCall(serviceName, duration, 200);

      // Cache successful response if cacheKey provided
      if (cacheKey && result && result.data) {
        setOfflineCache(cacheKey, result.data);
      }

      return { data: result ? result.data : null, error: null, isCached: false, durationMs: Math.round(duration) };

    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;
      const isAbort = err.name === 'AbortError' || err.code === 'TIMEOUT';
      const shouldRetry = attempt < retries && (isAbort || err.status >= 500 || err.code === 'PGRST301');

      if (shouldRetry) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1) + Math.random() * 200;
        await new Promise(res => setTimeout(res, delay));
      } else {
        break;
      }
    }
  }

  // All retries failed
  const duration = performance.now() - startTime;
  circuitBreaker.recordFailure(serviceName);
  telemetry.recordApiCall(serviceName, duration, lastError?.status || 500, lastError?.message);

  // Attempt offline cache recovery
  if (cacheKey) {
    const cached = getOfflineCache(cacheKey);
    if (cached) {
      return { data: cached, error: null, isCached: true, degraded: true };
    }
  }

  if (fallbackData !== null) {
    return { data: fallbackData, error: null, isFallback: true, degraded: true };
  }

  return { data: null, error: lastError instanceof ApiError ? lastError : new ApiError(lastError?.message || 'Network request failed', 'NETWORK_ERROR', 500, lastError) };
}

// Local Storage Offline Cache Helpers
function getOfflineCache(key) {
  try {
    const raw = localStorage.getItem(`radhe_cache_${key}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // 24-hour cache expiry
    if (Date.now() - parsed.timestamp > 86400000) {
      localStorage.removeItem(`radhe_cache_${key}`);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

function setOfflineCache(key, data) {
  try {
    localStorage.setItem(`radhe_cache_${key}`, JSON.stringify({
      timestamp: Date.now(),
      data
    }));
  } catch {
    // Quota exceeded or private browsing safe ignore
  }
}
