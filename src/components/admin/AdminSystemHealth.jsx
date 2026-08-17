import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, AlertTriangle, RefreshCw, Zap, Server, Database, Globe, CheckCircle2, Clock } from 'lucide-react';
import { telemetry } from '../../lib/observability/telemetry';
import { circuitBreaker, ServiceState } from '../../lib/resilience/circuitBreaker';
import StatusBadge from '../ui/StatusBadge';

export default function AdminSystemHealth() {
  const [metrics, setMetrics] = useState(telemetry.getMetricsSummary());
  const [logs, setLogs] = useState(telemetry.getRecentLogs());
  const [services, setServices] = useState(circuitBreaker.getAllServices());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Initial load
    setMetrics(telemetry.getMetricsSummary());
    setLogs(telemetry.getRecentLogs());
    setServices(circuitBreaker.getAllServices());

    // Subscribe to telemetry & circuit breaker events
    const unsubTelemetry = telemetry.subscribe((newMetrics, newLogs) => {
      setMetrics(newMetrics);
      setLogs([...newLogs]);
    });

    const unsubCircuit = circuitBreaker.subscribe(() => {
      setServices(circuitBreaker.getAllServices());
    });

    return () => {
      unsubTelemetry();
      unsubCircuit();
    };
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setMetrics(telemetry.getMetricsSummary());
    setLogs(telemetry.getRecentLogs());
    setServices(circuitBreaker.getAllServices());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleResetService = (serviceName) => {
    circuitBreaker.recordSuccess(serviceName);
    setServices(circuitBreaker.getAllServices());
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">System Health & Observability</h2>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time API performance, circuit breaker status, error correlation, and telemetry.
          </p>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Uptime Index</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{metrics.uptimePct}%</div>
          <div className="text-[11px] text-emerald-400/90 font-medium">Auto-healing active</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Avg API Latency</span>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white">{metrics.avgLatencyMs} <span className="text-xs font-normal text-slate-400">ms</span></div>
          <div className="text-[11px] text-slate-400">p95: {metrics.p95LatencyMs}ms</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Error Rate</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{metrics.errorRatePct}%</div>
          <div className="text-[11px] text-slate-400">{metrics.totalCalls} total tracked requests</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Circuit Breakers</span>
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {Object.values(services).filter(s => s.state === ServiceState.ACTIVE).length} / {Math.max(Object.keys(services).length, 4)}
          </div>
          <div className="text-[11px] text-blue-400">All critical services protected</div>
        </div>
      </div>

      {/* Services Health Matrix */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Server className="w-4 h-4 text-teal-400" /> Monitored Subsystems & Circuit Breakers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'supabase_db', name: 'Database & Auth API', icon: Database },
            { id: 'quote_engine', name: 'Actuarial Quote Engine', icon: Activity },
            { id: 'hospital_network', name: 'Cashless Hospital API', icon: Globe },
            { id: 'document_storage', name: 'Document Vault Storage', icon: Server }
          ].map(sub => {
            const status = services[sub.id]?.state || ServiceState.ACTIVE;
            const failures = services[sub.id]?.failureCount || 0;
            const SubIcon = sub.icon;

            return (
              <div key={sub.id} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                    <SubIcon className="w-4 h-4" />
                  </div>
                  <StatusBadge status={status.toLowerCase()} size="sm" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{sub.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Consecutive Failures: {failures}</p>
                </div>
                {status !== ServiceState.ACTIVE && (
                  <button
                    onClick={() => handleResetService(sub.id)}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg text-xs font-medium transition-all"
                  >
                    Reset Breaker
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Telemetry Live Event Stream */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" /> Recent System Logs & Telemetry Events
          </h3>
          <span className="text-xs text-slate-500 font-mono">Showing last {logs.length} events</span>
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-mono">
            No system events logged yet. Telemetry active.
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {logs.slice(0, 30).map((log) => {
              const isError = log.level === 'ERROR' || log.level === 'FATAL';
              const isWarn = log.level === 'WARN';

              return (
                <div
                  key={log.id}
                  className={`p-3 rounded-xl border text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    isError
                      ? 'bg-rose-950/20 border-rose-800/40 text-rose-300'
                      : isWarn
                      ? 'bg-amber-950/20 border-amber-800/40 text-amber-300'
                      : 'bg-slate-950/60 border-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isError ? 'bg-rose-500/20 text-rose-400' : isWarn ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {log.level}
                    </span>
                    <span className="text-slate-200 truncate">{log.message}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-slate-500 text-[11px]">
                    <span className="truncate">{log.url}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
