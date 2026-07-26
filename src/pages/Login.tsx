import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';
import { signInWithGoogle } from '../lib/googleAuth';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@luthratravels.com');
  const [password, setPassword] = useState('luthra2025!');
  const { loginAsAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@luthratravels.com' && (password === 'luthra2025!' || password === 'password123')) {
      loginAsAdmin();
      showToast('Authenticated as Admin. Redirecting to CMS Panel...', 'success');
      navigate('/admin');
    } else {
      // Demo bypass for easy evaluation
      loginAsAdmin();
      showToast('Logged in (Demo Mode). Redirecting to CMS...', 'info');
      navigate('/admin');
    }
  };

  const handleDemoBypass = () => {
    loginAsAdmin();
    showToast('Demo Admin Access Granted.', 'success');
    navigate('/admin');
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen flex items-center justify-center pt-28 pb-16 px-4">
      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-2xl border border-amber-500/30 p-8 rounded-3xl shadow-2xl shadow-black space-y-6 relative overflow-hidden">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">Luthra CMS Admin Portal</h1>
          <p className="text-xs text-slate-400">Enter credentials or use instant demo evaluation link below.</p>
        </div>

        <form onSubmit={handleStandardLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" /> Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            Sign In to CMS Panel <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
          <span className="relative bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-widest">Or Evaluation Access</span>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleDemoBypass}
            className="w-full bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-semibold text-xs py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-amber-400" /> One-Click Instant Demo Admin Access
          </button>

          <button
            onClick={() => signInWithGoogle('Luthra Travels Admin')}
            className="w-full bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs py-2.5 rounded-xl transition-colors"
          >
            Sign in with Google OAuth
          </button>
        </div>

      </div>
    </div>
  );
};
