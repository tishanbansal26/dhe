import { describe, it, expect, beforeEach, vi } from 'vitest';
import { circuitBreaker, ServiceState } from '../resilience/circuitBreaker';
import { executeResilientQuery, ApiError } from '../resilience/apiClient';

describe('CircuitBreaker & Self-Healing Engine', () => {
  const testService = 'test_service_auth';

  beforeEach(() => {
    circuitBreaker.recordSuccess(testService);
  });

  it('starts in ACTIVE state', () => {
    expect(circuitBreaker.getServiceStatus(testService)).toBe(ServiceState.ACTIVE);
    expect(circuitBreaker.canExecute(testService)).toBe(true);
  });

  it('transitions to DEGRADED on repeated failures', () => {
    circuitBreaker.recordFailure(testService);
    circuitBreaker.recordFailure(testService);
    expect(circuitBreaker.getServiceStatus(testService)).toBe(ServiceState.DEGRADED);
    expect(circuitBreaker.canExecute(testService)).toBe(true);
  });

  it('opens circuit after reaching threshold', () => {
    circuitBreaker.recordFailure(testService);
    circuitBreaker.recordFailure(testService);
    circuitBreaker.recordFailure(testService);
    circuitBreaker.recordFailure(testService);
    expect(circuitBreaker.getServiceStatus(testService)).toBe(ServiceState.CIRCUIT_OPEN);
    expect(circuitBreaker.canExecute(testService)).toBe(false);
  });

  it('auto-recovers back to ACTIVE on recordSuccess', () => {
    circuitBreaker.recordFailure(testService);
    circuitBreaker.recordFailure(testService);
    circuitBreaker.recordFailure(testService);
    circuitBreaker.recordFailure(testService);
    expect(circuitBreaker.getServiceStatus(testService)).toBe(ServiceState.CIRCUIT_OPEN);

    circuitBreaker.recordSuccess(testService);
    expect(circuitBreaker.getServiceStatus(testService)).toBe(ServiceState.ACTIVE);
    expect(circuitBreaker.canExecute(testService)).toBe(true);
  });
});

describe('executeResilientQuery Client', () => {
  it('returns data when query succeeds', async () => {
    const mockQuery = vi.fn().mockResolvedValue({ data: [{ id: 1, name: 'Term Plan' }], error: null });
    const res = await executeResilientQuery('test_plan_query', mockQuery);

    expect(res.data).toEqual([{ id: 1, name: 'Term Plan' }]);
    expect(res.error).toBeNull();
  });

  it('returns fallbackData when query fails all retries', async () => {
    const mockQuery = vi.fn().mockRejectedValue(new Error('Network drop'));
    const res = await executeResilientQuery('test_fail_query', mockQuery, {
      retries: 1,
      fallbackData: [{ id: 99, name: 'Cached Plan' }]
    });

    expect(res.data).toEqual([{ id: 99, name: 'Cached Plan' }]);
    expect(res.isFallback).toBe(true);
  });
});
