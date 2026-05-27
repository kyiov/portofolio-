import React, { useState, useEffect } from 'react';
import { Server, Activity, Database, Clock } from 'lucide-react';

const SystemDashboard: React.FC = () => {
  const [memory, setMemory] = useState(45);
  const [cpu, setCpu] = useState(12);
  const [uptime, setUptime] = useState(0);
  const [logs, setLogs] = useState<string[]>(['[SYS] Dashboard initialized.']);

  // Simulate hardware metrics
  useEffect(() => {
    const metricsInterval = setInterval(() => {
      setMemory(prev => Math.min(100, Math.max(10, prev + (Math.random() * 10 - 5))));
      setCpu(prev => Math.min(100, Math.max(2, prev + (Math.random() * 20 - 10))));
    }, 2000);
    return () => clearInterval(metricsInterval);
  }, []);

  // Simulate Uptime
  useEffect(() => {
    const startTime = Date.now() - (7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000); // 7 days 4 hours ago
    const uptimeInterval = setInterval(() => {
      setUptime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(uptimeInterval);
  }, []);

  // Simulate live logs
  useEffect(() => {
    const logEvents = [
      '[BOT] Processed 142 requests in last minute.',
      '[API] Health check passed: 22ms response time.',
      '[WARN] Rate limit threshold approaching for service A.',
      '[DB] Optimized query cache. Hit rate: 98%.',
      '[SYS] Running garbage collection...',
      '[BOT] New automation script deployed successfully.',
      '[NET] Active connections: 1,024',
    ];

    const logInterval = setInterval(() => {
      const newLog = logEvents[Math.floor(Math.random() * logEvents.length)];
      setLogs(prev => {
        const updated = [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} ${newLog}`];
        return updated.slice(-5); // Keep last 5 logs
      });
    }, 3000);
    return () => clearInterval(logInterval);
  }, []);

  const formatUptime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${days}d ${hours}h ${mins}m ${secs}s`;
  };

  return (
    <section className="py-12 px-6">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 font-vt323">
          <Server className="w-5 h-5 text-[#4d924c]" />
          System Status
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-vt323">
          
          {/* Hardware Metrics */}
          <div className="bento-card col-span-1 p-6 flex flex-col justify-center gap-6 border-[#4d924c]/30">
            <div>
              <div className="flex justify-between mb-1 text-sm text-white/70">
                <span className="flex items-center gap-1"><Activity className="w-4 h-4" /> CPU</span>
                <span>{cpu.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#4d924c] transition-all duration-500 ease-out"
                  style={{ width: `${cpu}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1 text-sm text-white/70">
                <span className="flex items-center gap-1"><Database className="w-4 h-4" /> RAM</span>
                <span>{memory.toFixed(1)}% (16GB)</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#4d924c] transition-all duration-500 ease-out"
                  style={{ width: `${memory}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Uptime */}
          <div className="bento-card col-span-1 p-6 flex flex-col items-center justify-center border-[#4d924c]/30">
             <Clock className="w-8 h-8 text-[#4d924c] mb-4" />
             <div className="text-sm text-white/50 mb-1">Server Uptime</div>
             <div className="text-2xl font-bold text-white">{formatUptime(uptime)}</div>
             <div className="text-xs text-[#4d924c] mt-2 animate-pulse">● System Operational</div>
          </div>

          {/* Live Logs */}
          <div className="bento-card col-span-1 p-6 bg-black border-white/10 text-xs text-[#4d924c] flex flex-col justify-end">
            <div className="flex flex-col gap-1 opacity-80">
              {logs.map((log, i) => (
                <div key={i} className="animate-fade-in truncate">{log}</div>
              ))}
            </div>
            <div className="mt-2 h-[1px] w-full bg-[#4d924c]/30 relative">
               <div className="absolute top-0 left-0 h-full w-1/4 bg-[#4d924c] animate-[slide_2s_infinite]"></div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default SystemDashboard;