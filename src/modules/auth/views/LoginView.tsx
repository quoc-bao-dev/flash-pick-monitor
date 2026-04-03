import { Activity, Cpu, Network, ShieldCheck, Clock } from 'lucide-react';
import { LoginForm } from '../components/LoginForm';

export function LoginView() {
  return (
    <div className="bg-background font-body text-on-surface min-h-screen selection:bg-primary/30 overflow-x-hidden relative">
      {/* Background Layering */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(at 0% 0%, rgba(249, 115, 22, 0.1) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(8, 14, 29, 1) 0px, transparent 50%)
          `,
        }}
      />
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
        }}
      />

      {/* Decorative Floating Elements */}
      <div className="fixed top-1/4 -left-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-1/4 -right-20 w-80 h-80 bg-tertiary/5 blur-[100px] rounded-full pointer-events-none" />

      <main className="relative z-10 flex flex-col lg:flex-row min-h-screen w-full">
        {/* Left Side: Brand and Auth Form */}
        <div className="w-full lg:w-[60%] flex flex-col items-center justify-center p-6 lg:p-12 xl:p-20 border-r border-white/5">
          <div className="w-full max-w-md">
            <LoginForm />

            <footer className="mt-12 text-center space-y-4">
              <div className="flex items-center justify-center space-x-6">
                <a
                  href="#"
                  className="text-[10px] font-bold text-slate-500 hover:text-primary transition-colors uppercase tracking-widest"
                >
                  Protocol
                </a>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <a
                  href="#"
                  className="text-[10px] font-bold text-slate-500 hover:text-primary transition-colors uppercase tracking-widest"
                >
                  Legal
                </a>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <a
                  href="#"
                  className="text-[10px] font-bold text-slate-500 hover:text-primary transition-colors uppercase tracking-widest"
                >
                  Status
                </a>
              </div>
              <p className="text-[9px] text-slate-600 max-w-[200px] mx-auto leading-relaxed">
                Authorized access only. All system interactions are logged under the Kinetic Protocol V2.4.
              </p>
            </footer>
          </div>
        </div>

        {/* Right Side: Network Pulse Display */}
        <div className="w-full lg:w-[40%] flex flex-col items-center justify-center p-6 lg:p-12 xl:p-20 bg-black/10">
          <div className="w-full max-w-2xl space-y-8">
            <div className="glass-panel rounded-[3rem] p-10 lg:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -mr-32 -mt-32 pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-8">
                  <Activity className="w-24 h-24 text-primary/50" strokeWidth={1.5} />
                </div>
                <h3 className="font-headline text-4xl lg:text-5xl font-bold text-white mb-4">Network Pulse</h3>
                <p className="text-slate-400 text-lg">Monitoring 142 Active Nodes</p>

                <div className="mt-12 w-full max-w-md mx-auto">
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-4">
                    <div className="w-[72%] h-full bg-primary shadow-[0_0_25px_rgba(249,115,22,0.6)]" />
                  </div>
                  <div className="flex justify-between text-xs font-mono font-bold text-primary tracking-widest">
                    <span>CPU LOAD: 72.4%</span>
                    <span>LATENCY: 12ms</span>
                  </div>
                </div>
              </div>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Cpu className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RAM Usage</span>
                  </div>
                  <div className="text-2xl font-headline font-bold text-white">
                    42.8<span className="text-sm text-slate-500 ml-1">GB</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Network className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Throughput</span>
                  </div>
                  <div className="text-2xl font-headline font-bold text-white">
                    1.2<span className="text-sm text-slate-500 ml-1">Gbps</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Threats Blocked
                    </span>
                  </div>
                  <div className="text-2xl font-headline font-bold text-white">0</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-3 border border-white/5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  All Systems Operational
                </span>
              </div>
              <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-3 border border-white/5">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  Uptime: 14d 02h 45m
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
