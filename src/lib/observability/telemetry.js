/**
 * Observability & Structured Telemetry Service for Radhe Investments
 * Captures API latency, error correlation IDs, UI health events, and exposes metrics for admin dashboards.
 */

class TelemetryService {
  constructor() {
    this.logs = [];
    this.apiMetrics = [];
    this.maxLogs = 200;
    this.listeners = new Set();
    this.sessionId = this._generateCorrelationId('sess');
  }

  _generateCorrelationId(prefix = 'req') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  recordApiCall(service, durationMs, statusCode, errorMsg = null) {
    const metric = {
      id: this._generateCorrelationId('api'),
      service,
      durationMs: Math.round(durationMs),
      statusCode,
      errorMsg,
      timestamp: new Date().toISOString()
    };

    this.apiMetrics.push(metric);
    if (this.apiMetrics.length > this.maxLogs) this.apiMetrics.shift();

    if (statusCode >= 400 || errorMsg) {
      this.recordLog('ERROR', `API ${service} failed with status ${statusCode}: ${errorMsg}`, { metric });
    }

    this._notify();
  }

  recordCircuitBreak(service) {
    this.recordLog('WARN', `Circuit breaker tripped for service: ${service}`, { service });
  }

  recordLog(level, message, context = {}) {
    const entry = {
      id: this._generateCorrelationId('log'),
      sessionId: this.sessionId,
      level, // 'INFO', 'WARN', 'ERROR', 'FATAL'
      message,
      context,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.pathname : '/'
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) this.logs.pop();

    if (level === 'ERROR' || level === 'FATAL') {
      console.warn(`[RadheTelemetry:${level}]`, message, context);
    }

    this._notify();
  }

  getMetricsSummary() {
    const totalCalls = this.apiMetrics.length;
    if (totalCalls === 0) {
      return {
        totalCalls: 0,
        avgLatencyMs: 0,
        errorRatePct: 0,
        uptimePct: 100,
        p95LatencyMs: 0
      };
    }

    const failedCalls = this.apiMetrics.filter(m => m.statusCode >= 400).length;
    const totalDuration = this.apiMetrics.reduce((acc, m) => acc + m.durationMs, 0);
    const sortedDurations = [...this.apiMetrics].map(m => m.durationMs).sort((a, b) => a - b);
    const p95Index = Math.floor(sortedDurations.length * 0.95);

    return {
      totalCalls,
      avgLatencyMs: Math.round(totalDuration / totalCalls),
      errorRatePct: Math.round((failedCalls / totalCalls) * 1000) / 10,
      uptimePct: Math.round(((totalCalls - failedCalls) / totalCalls) * 1000) / 10,
      p95LatencyMs: sortedDurations[p95Index] || sortedDurations[sortedDurations.length - 1] || 0
    };
  }

  getRecentLogs(limit = 50) {
    return this.logs.slice(0, limit);
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  _notify() {
    this.listeners.forEach(cb => {
      try {
        cb(this.getMetricsSummary(), this.logs);
      } catch (err) {
        console.error('Telemetry notification error:', err);
      }
    });
  }
}

export const telemetry = new TelemetryService();
