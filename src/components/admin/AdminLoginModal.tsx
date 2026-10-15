import React, { useState } from 'react';
import { AdminUser } from '../../types';
import { Lock, User, Key, Eye, EyeOff, ShieldCheck, X, Sparkles, ArrowLeft } from 'lucide-react';
import { TasteHevenLogo } from '../TasteHevenLogo';

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
        (u.username.toLowerCase().trim() === username.toLowerCase().trim() ||
          (username.toLowerCase().trim() === 'admin' && u.username === 'ahmad')) &&
        u.password === password
    );

    if (matched) {
      onLoginSuccess(matched);
      setPassword('');
      setError('');
      onClose();
    } else {
      setError('غلط یوزر نیم یا پاس ورڈ۔ براہ کرم اپنا درست پاس ورڈ درج کریں۔ (Invalid username or password)');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    setShowPassword(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <TasteHevenLogo variant="badge" size={48} />
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Taste Heven Owners Portal
            </h2>
            <p className="text-xs text-stone-500">
              Secure Management Login (احمد وسیم & فرمان علی)
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <Lock className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Secure Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Username (یوزر نیم):
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter owner username"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D4AF37] focus:bg-white text-stone-900 transition-colors"
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
            className="w-full py-3 px-4 bg-[#0A0A0A] hover:bg-[#1A1A1A] text-[#D4AF37] border border-[#D4AF37]/50 font-bold text-sm rounded-xl shadow-xs transition-colors cursor-pointer mt-2 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Login to Admin Dashboard</span>
          </button>

          {/* Back to Website Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-[#0A0A0A] font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border border-stone-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#0A0A0A]" />
            <span>← واپس کسٹمر ویب سائٹ پر جائیں (Back to Store)</span>
          </button>
        </form>
      </div>
    </div>
  );
};
