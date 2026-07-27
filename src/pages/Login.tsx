import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('admin@luthratravels.com');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password) {
      setErrorMessage('Invalid Username or Password');
      return;
    }

    setSubmitting(true);

    try {
      await login(identifier.trim(), password);
      showToast('Authenticated successfully. Opening Admin Dashboard...', 'success');
      navigate(from, { replace: true });
    } catch (err: any) {
      const errorText = 'Invalid Username or Password';
      setErrorMessage(errorText);
      showToast(errorText, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen flex items-center justify-center pt-28 pb-16 px-4">
      <div className="max-w-md w-full bg-zinc-900/90 backdrop-blur-2xl border border-[#C9A227]/30 p-8 rounded-3xl shadow-2xl shadow-black space-y-6 relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-2 relative z-10">
          <div className="w-12 h-12 bg-[#C9A227]/10 border border-[#C9A227]/30 rounded-2xl flex items-center justify-center mx-auto text-[#C9A227]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white">Luthra CMS Admin Portal</h1>
          <p className="text-xs text-zinc-400 font-mono">Restricted Access • Authenticated Staff Only</p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="bg-rose-950/80 border border-rose-500/50 p-3.5 rounded-xl flex items-center gap-2.5 text-xs text-rose-200 font-semibold animate-fadeIn relative z-10">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4 relative z-10">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#C9A227]" /> Username or Admin Email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="admin or admin@luthratravels.com"
              required
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#C9A227]" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Enter password"
              required
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="gold"
              size="md"
              fullWidth
              isLoading={submitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {submitting ? 'Verifying...' : 'Sign In to Admin Panel'}
            </Button>
          </div>
        </form>

        <div className="text-center pt-2 text-[11px] text-zinc-500 font-mono relative z-10 border-t border-zinc-800/80">
          <span>Protected Area • Unauthorized Attempts Logged</span>
        </div>

      </div>
    </div>
  );
};
