import React, { useState } from 'react';
import { Hexagon, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Login: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('owner@nexus.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate secure handshake
    setTimeout(() => {
      const success = login(email);
      if (!success) {
        setError('Authentication Failed: Invalid ID or Password.');
        setIsLoading(false);
      }
      // If success, App.tsx will re-render
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-5xl bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 flex flex-col md:flex-row relative z-10">
        
        {/* Left Side: Brand */}
        <div className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-indigo-950 to-slate-900 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-8">
               <div className="bg-indigo-600 p-2 rounded-xl">
                 <Hexagon size={28} className="text-white" fill="currentColor" />
               </div>
               <span className="text-2xl font-bold text-white tracking-tight">Nexus ERP</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">Secure Enterprise Portal</h1>
            <p className="text-indigo-200/60 text-lg">Production Environment v3.5.0</p>
          </div>
          
          <div className="space-y-4 mt-12">
             <div className="flex items-center gap-4 text-emerald-400 font-medium">
                <ShieldCheck /> <span>Secure Connection (TLS 1.3)</span>
             </div>
             <p className="text-slate-500 text-sm">Authorized personnel only. All activities are monitored and logged.</p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-8 md:p-12 bg-slate-900">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-slate-400 mb-8">Access your workspace.</p>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-sm">
                 <AlertCircle size={18} />
                 {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Corporate Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-12 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="name@nexus.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-12 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500/20" />
                  Keep me signed in
                </label>
                <a href="#" className="text-indigo-400 hover:text-indigo-300">SSO Login</a>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Authenticating...' : 'Access Portal'}
                {!isLoading && <ArrowRight size={20} />}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-800">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-4">Demo Accounts</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button type="button" onClick={() => setEmail('owner@nexus.com')} className="p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 transition-colors">Owner (Admin)</button>
                <button type="button" onClick={() => setEmail('manager@nexus.com')} className="p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 transition-colors">Manager (Ops)</button>
                <button type="button" onClick={() => setEmail('marketing@nexus.com')} className="p-2 bg-slate-800/50 hover:bg-slate-800 text-indigo-300 border border-indigo-900/30 rounded transition-colors">Marketing (Sales)</button>
                <button type="button" onClick={() => setEmail('finance@nexus.com')} className="p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 transition-colors">Finance ($$$)</button>
                <button type="button" onClick={() => setEmail('warehouse@nexus.com')} className="p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 transition-colors">Warehouse (Stock)</button>
                <button type="button" onClick={() => setEmail('auditor@nexus.com')} className="p-2 bg-slate-800/50 hover:bg-slate-800 text-emerald-400 border border-slate-800 transition-colors">Auditor (Read)</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;