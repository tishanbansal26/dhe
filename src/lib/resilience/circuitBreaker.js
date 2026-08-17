/**
 * Circuit Breaker & Service Health State Machine for Radhe Investments
 * Tracks consecutive failures, handles self-healing auto-recovery, and provides state events.
 */

export const ServiceState = {
  ACTIVE: 'ACTIVE',
  DEGRADED: 'DEGRADED',
  CIRCUIT_OPEN: 'CIRCUIT_OPEN',
  MAINTENANCE: 'MAINTENANCE',
  OFFLINE: 'OFFLINE'
};

class CircuitBreaker {
  constructor() {
    this.services = new Map();
    this.subscribers = new Set();
    this.failureThreshold = 4; // Open circuit after 4 consecutive failures
    this.resetTimeoutMs = 30000; // Attempt recovery after 30s
  }

  _getService(name) {
    if (!this.services.has(name)) {
      this.services.set(name, {
        name,
        state: ServiceState.ACTIVE,
        failureCount: 0,
        successCount: 0,
        lastFailureTime: null,
        lastSuccessTime: Date.now(),
        nextAttemptTime: 0
      });
    }
    return this.services.get(name);
  }

  canExecute(name) {
    const service = this._getService(name);
    const now = Date.now();

    if (service.state === ServiceState.CIRCUIT_OPEN) {
      if (now >= service.nextAttemptTime) {
        // Half-open state: allow single probe
        return true;
      }
      return false;
    }
    return true;
  }

  recordSuccess(name) {
    const service = this._getService(name);
    service.failureCount = 0;
    service.successCount += 1;
    service.lastSuccessTime = Date.now();

    if (service.state !== ServiceState.ACTIVE) {
      service.state = ServiceState.ACTIVE;
      this._notify(name, service);
    }
  }

  recordFailure(name) {
    const service = this._getService(name);
    service.failureCount += 1;
    service.lastFailureTime = Date.now();

    if (service.failureCount >= this.failureThreshold) {
      service.state = ServiceState.CIRCUIT_OPEN;
      service.nextAttemptTime = Date.now() + this.resetTimeoutMs;
      this._notify(name, service);
    } else if (service.failureCount >= 2 && service.state === ServiceState.ACTIVE) {
      service.state = ServiceState.DEGRADED;
      this._notify(name, service);
    }
  }

  getServiceStatus(name) {
    return this._getService(name).state;
  }

  getAllServices() {
    const list = {};
    for (const [key, val] of this.services.entries()) {
      list[key] = { ...val };
    }
    return list;
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  _notify(name, service) {
    this.subscribers.forEach(cb => {
      try {
        cb(name, service.state, service);
      } catch (err) {
        console.error('CircuitBreaker subscriber error:', err);
      }
    });
  }
}

export const circuitBreaker = new CircuitBreaker();
