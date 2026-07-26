import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Key,
  Lock,
  User,
  Mail,
  Phone,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Smartphone,
  Globe,
  Clock,
  LogOut,
  UserPlus,
  Trash2,
  RefreshCw,
  AlertCircle,
  Check,
  ShieldAlert,
} from 'lucide-react';
import {
  authSecurityService,
  AdminUserProfile,
  ActiveSession,
  LoginHistoryItem,
} from '../services/authSecurityService';
import { useToast } from '../contexts/ToastContext';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

export const AdminSecurityPanel: React.FC = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AdminUserProfile>({
    name: 'Vikram Luthra',
    email: 'admin@luthratravels.com',
    phone: '+91 99589 56593',
    role: 'SUPER_ADMIN',
    avatar_url:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    is_2fa_enabled: false,
    last_login_at: new Date().toISOString(),
  });

  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([]);
  const [teamUsers, setTeamUsers] = useState<AdminUserProfile[]>([]);

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Profile Edit State
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [avatarInput, setAvatarInput] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // New Admin Creation Form State
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'ADMIN' | 'SUPER_ADMIN'>('ADMIN');
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  const loadSecurityData = async () => {
    setLoading(true);
    try {
      const data = await authSecurityService.getSecurityOverview(profile.email);
      setProfile(data.user);
      setNameInput(data.user.name);
      setEmailInput(data.user.email);
      setPhoneInput(data.user.phone);
      setAvatarInput(data.user.avatar_url || '');

      setActiveSessions(data.activeSessions);
      setLoginHistory(data.loginHistory);
      setTeamUsers(data.teamUsers);
    } catch (err: any) {
      console.error('Error loading security data:', err);
      showToast('Error syncing security profile: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSecurityData();
  }, []);

  // Password Strength Calculation
  const checkReqs = {
    minChar: newPassword.length >= 8,
    hasUpper: /[A-Z]/.test(newPassword),
    hasLower: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
  };

  const passScore = Object.values(checkReqs).filter(Boolean).length;
  const strengthLabel =
    passScore <= 2 ? 'Weak' : passScore === 3 ? 'Fair' : passScore === 4 ? 'Good' : 'Strong';
  const strengthColor =
    passScore <= 2
      ? 'bg-rose-500 text-rose-400'
      : passScore === 3
      ? 'bg-amber-500 text-amber-400'
      : passScore === 4
      ? 'bg-blue-500 text-blue-400'
      : 'bg-emerald-500 text-emerald-400';

  // PROFILE SAVE
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await authSecurityService.updateProfile(profile.email, {
        name: nameInput.trim(),
        email: emailInput.trim(),
        phone: phoneInput.trim(),
        avatar_url: avatarInput.trim(),
      });
      setProfile(updated);
      showToast('Account profile successfully updated.', 'success');
      loadSecurityData();
    } catch (err: any) {
      showToast(err.message || 'Error updating profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  // PASSWORD CHANGE
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    if (passScore < 5) {
      showToast('Password does not meet all security requirements.', 'error');
      return;
    }

    setChangingPassword(true);
    try {
      await authSecurityService.changePassword(profile.email, currentPassword, newPassword);
      showToast('Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      loadSecurityData();
    } catch (err: any) {
      showToast(err.message || 'Error updating password', 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  // TOGGLE 2FA
  const handleToggle2FA = async () => {
    const nextState = !profile.is_2fa_enabled;
    try {
      const updated = await authSecurityService.toggle2FA(profile.email, nextState);
      setProfile({ ...profile, is_2fa_enabled: updated });
      showToast(
        updated
          ? 'Two-Factor Authentication (2FA) enabled.'
          : 'Two-Factor Authentication disabled.',
        'info'
      );
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // TERMINATE OTHER SESSIONS
  const handleRevokeSessions = async () => {
    if (!window.confirm('Terminate active sessions on all other devices?')) return;
    try {
      await authSecurityService.revokeOtherSessions(profile.email);
      showToast('All other active sessions have been terminated.', 'success');
      loadSecurityData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // CREATE NEW ADMIN USER
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName || !newAdminEmail) return;

    setCreatingAdmin(true);
    try {
      await authSecurityService.createAdminUser({
        name: newAdminName.trim(),
        email: newAdminEmail.trim(),
        phone: newAdminPhone.trim(),
        role: newAdminRole,
      });
      showToast('New Admin account successfully created!', 'success');
      setShowAddAdminModal(false);
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPhone('');
      loadSecurityData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setCreatingAdmin(false);
    }
  };

  // DELETE ADMIN USER
  const handleDeleteAdmin = async (id: number) => {
    if (!window.confirm('Permanently revoke and delete this Admin account?')) return;
    try {
      await authSecurityService.deleteAdminUser(id);
      showToast('Admin account removed.', 'info');
      loadSecurityData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-zinc-400">Loading Account &amp; Security Controls...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                profile.avatar_url ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
              }
              alt={profile.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C9A227]"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-zinc-900 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold text-white">{profile.name}</h2>
              <Badge variant="gold" dot>
                {profile.role}
              </Badge>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">{profile.email} • {profile.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={loadSecurityData} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Sync Audit Logs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Profile & Password Forms */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 1. Profile Details Form */}
          <form onSubmit={handleSaveProfile} className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[#C9A227]" /> Admin Profile Information
              </h3>
              <span className="text-[11px] font-mono text-zinc-400">Role: {profile.role}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Admin Full Name *</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Email Address *</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl p-3 text-white focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Contact Phone Number</label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl p-3 text-white focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Profile Avatar URL</label>
                <input
                  type="text"
                  value={avatarInput}
                  onChange={(e) => setAvatarInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl p-3 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="gold" size="sm" type="submit" isLoading={savingProfile}>
                Save Profile Changes
              </Button>
            </div>
          </form>

          {/* 2. Change Password Form */}
          <form onSubmit={handleChangePassword} className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-5">
            <div className="border-b border-zinc-800 pb-4">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-[#C9A227]" /> Security &amp; Password Update
              </h3>
              <p className="text-xs text-zinc-400 mt-1">Verify current password and enforce strong credentials.</p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Current Password */}
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Current Password *</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl p-3 text-white pr-10 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">New Password *</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 chars, uppercase, number & symbol"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl p-3 text-white pr-10 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              {/* Live Password Strength Bar */}
              {newPassword && (
                <div className="space-y-3 p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Password Strength:</span>
                    <span className={`font-bold font-mono ${strengthColor.split(' ')[1]}`}>
                      {strengthLabel} ({passScore}/5)
                    </span>
                  </div>

                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strengthColor.split(' ')[0]}`}
                      style={{ width: `${(passScore / 5) * 100}%` }}
                    />
                  </div>

                  {/* Checklist */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className={`flex items-center gap-1.5 ${checkReqs.minChar ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {checkReqs.minChar ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>8+ Characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${checkReqs.hasUpper ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {checkReqs.hasUpper ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Uppercase Letter</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${checkReqs.hasLower ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {checkReqs.hasLower ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Lowercase Letter</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${checkReqs.hasNumber ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {checkReqs.hasNumber ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Number (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${checkReqs.hasSpecial ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {checkReqs.hasSpecial ? <Check className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>Special Symbol</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="gold" size="sm" type="submit" isLoading={changingPassword}>
                Update Password
              </Button>
            </div>
          </form>

        </div>

        {/* RIGHT COLUMN: 2FA, Active Sessions, Login Logs, Admin Team */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* 3. Two-Factor Authentication (2FA) */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#C9A227]" /> Two-Factor Auth (2FA)
                </h3>
                <span className="text-xs text-zinc-400">Future-ready authenticator security layer</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.is_2fa_enabled || false}
                  onChange={handleToggle2FA}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A227]" />
              </label>
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs text-zinc-400 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Multi-Factor Protection
              </div>
              <p className="leading-relaxed">
                When enabled, sign-ins will require a time-based TOTP code or SMS code verification.
              </p>
            </div>
          </div>

          {/* 4. Active Logged-in Sessions */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#C9A227]" /> Active Sessions
              </h3>
              <button
                onClick={handleRevokeSessions}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Revoke Others
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {activeSessions.map((session) => (
                <div key={session.id} className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white block">{session.device_name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono block">IP: {session.ip_address}</span>
                  </div>
                  {session.is_current ? (
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                      Current
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-500 font-mono">Active</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 5. Login History */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#C9A227]" /> Recent Login History
            </h3>

            <div className="space-y-2.5 text-xs max-h-56 overflow-y-auto pr-1">
              {loginHistory.map((item) => (
                <div key={item.id} className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-white block truncate max-w-[180px]">{item.user_agent}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{new Date(item.login_at).toLocaleString()} • IP: {item.ip_address}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Admin Team Management (Super Admin Privileges) */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#C9A227]" /> Admin Accounts Team
                </h3>
                <span className="text-[10px] text-zinc-400">Super Admin User Permissions</span>
              </div>
              {profile.role === 'SUPER_ADMIN' && (
                <button
                  onClick={() => setShowAddAdminModal(true)}
                  className="bg-[#C9A227] text-zinc-950 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-[#b8911d] transition-colors"
                >
                  + Add Admin
                </button>
              )}
            </div>

            <div className="space-y-3 text-xs">
              {teamUsers.map((usr) => (
                <div key={usr.id} className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block">{usr.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono block">{usr.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={usr.role === 'SUPER_ADMIN' ? 'gold' : 'dark'}>
                      {usr.role}
                    </Badge>
                    {profile.role === 'SUPER_ADMIN' && usr.email !== profile.email && (
                      <button
                        onClick={() => usr.id && handleDeleteAdmin(usr.id)}
                        className="text-rose-400 hover:text-rose-300 p-1 rounded"
                        title="Remove Admin Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* CREATE ADMIN MODAL */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleCreateAdmin} className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-3xl max-w-md w-full space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#C9A227]">Create New Admin Account</h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300">Admin Full Name *</label>
                <input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="e.g. Ananya Sharma"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300">Admin Email Address *</label>
                <input
                  type="email"
                  required
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="ananya@luthratravels.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300">Phone Number</label>
                <input
                  type="tel"
                  value={newAdminPhone}
                  onChange={(e) => setNewAdminPhone(e.target.value)}
                  placeholder="+91 98100 12345"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300">Role Privilege</label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  <option value="ADMIN">ADMIN (Standard)</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN (Full Access)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
              <Button variant="secondary" size="sm" type="button" onClick={() => setShowAddAdminModal(false)}>
                Cancel
              </Button>
              <Button variant="gold" size="sm" type="submit" isLoading={creatingAdmin}>
                Create Account
              </Button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
