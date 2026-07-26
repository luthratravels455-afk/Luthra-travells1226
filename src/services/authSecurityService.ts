export interface AdminUserProfile {
  id?: number;
  name: string;
  email: string;
  phone: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  avatar_url?: string;
  is_2fa_enabled?: boolean;
  last_login_at?: string;
  created_at?: string;
}

export interface ActiveSession {
  id: number;
  admin_email: string;
  device_name: string;
  ip_address: string;
  last_active_at: string;
  is_current: boolean;
}

export interface LoginHistoryItem {
  id: number;
  admin_email: string;
  ip_address: string;
  user_agent: string;
  login_at: string;
  status: 'SUCCESS' | 'FAILED';
}

export interface SecurityOverviewData {
  user: AdminUserProfile;
  activeSessions: ActiveSession[];
  loginHistory: LoginHistoryItem[];
  teamUsers: AdminUserProfile[];
}

export const authSecurityService = {
  async getSecurityOverview(email: string = 'admin@luthratravels.com'): Promise<SecurityOverviewData> {
    const res = await fetch(`/api/security?email=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error('Failed to fetch security data');
    return res.json();
  },

  async updateProfile(email: string, updates: Partial<AdminUserProfile>): Promise<AdminUserProfile> {
    const res = await fetch('/api/security', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'UPDATE_PROFILE', email, updates })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update profile');
    }
    const data = await res.json();
    return data.user;
  },

  async changePassword(email: string, currentPassword: string, newPassword: string): Promise<void> {
    const res = await fetch('/api/security', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'CHANGE_PASSWORD', email, currentPassword, newPassword })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to change password');
    }
  },

  async toggle2FA(email: string, is_2fa_enabled: boolean): Promise<boolean> {
    const res = await fetch('/api/security', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'TOGGLE_2FA', email, is_2fa_enabled })
    });
    if (!res.ok) throw new Error('Failed to toggle 2FA setting');
    const data = await res.json();
    return data.is_2fa_enabled;
  },

  async revokeOtherSessions(email: string): Promise<void> {
    const res = await fetch('/api/security', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'REVOKE_OTHER_SESSIONS', email })
    });
    if (!res.ok) throw new Error('Failed to terminate other sessions');
  },

  async createAdminUser(newAdmin: { name: string; email: string; phone?: string; role?: string }): Promise<AdminUserProfile> {
    const res = await fetch('/api/security', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'CREATE_ADMIN', newAdmin })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create admin user');
    }
    const data = await res.json();
    return data.user;
  },

  async deleteAdminUser(id: number): Promise<void> {
    const res = await fetch(`/api/security?id=${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete admin user');
  }
};
