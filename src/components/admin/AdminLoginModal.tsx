import React, { useState } from 'react';
import { AdminUser } from '../../types';
import { Lock, User, Key, Eye, EyeOff, ShieldCheck, X, Sparkles } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
  adminUsers: AdminUser[];
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  adminUsers,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const matched = adminUsers.find(
      (u) =>
        u.username.toLowerCase().trim() === username.toLowerCase().trim() &&
        u.password === password
    );

    if (matched) {
      onLoginSuccess(matched);
      onClose();
    } else {
      setError('Invalid username or password. Please verify credentials below.');
    }
  };

  const handleQuickFill = (user: AdminUser) => {
    setUsername(user.username);
    setPassword(user.password);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-950 text-amber-400 flex items-center justify-center shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Taste Heven Admin Portal
            </h2>
            <p className="text-xs text-stone-500">
              Staff and Store Management Access
            </p>
          </div>
        </div>

        {/* Quick Credentials Info Box (for the 4 users) */}
        <div className="mb-6 p-3.5 bg-amber-50/80 rounded-xl border border-amber-200/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>4 Authorized Admin Accounts:</span>
          </div>
          <p className="text-[11px] text-amber-800 mb-2.5">
            Click any account to auto-fill credentials:
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {adminUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickFill(u)}
                className="text-left p-2 bg-white rounded-lg border border-amber-200/60 hover:border-amber-400 hover:bg-amber-100/40 transition-colors text-[11px] cursor-pointer"
              >
                <div className="font-bold text-stone-900 truncate">{u.name}</div>
                <div className="text-stone-500 text-[10px] truncate">{u.role}</div>
                <div className="text-amber-800 font-mono text-[10px] mt-0.5">
                  user: <strong className="font-semibold">{u.username}</strong>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Username:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or manager"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600 focus:bg-white text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Password:
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-10 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-amber-600 focus:bg-white text-stone-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 p-0.5"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-emerald-950 hover:bg-emerald-900 text-amber-200 font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer mt-2 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Login to Admin Dashboard</span>
          </button>
        </form>
      </div>
    </div>
  );
};
