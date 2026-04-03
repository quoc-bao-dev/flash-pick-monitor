'use client';

import { AtSign, ArrowRight, Eye, EyeOff, Key, Shield, Terminal } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/common/components/ui/Button';
import { Input } from '@/common/components/ui/Input';
import { Checkbox } from '@/common/components/ui/Checkbox';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [maintainSession, setMaintainSession] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      {/* Brand Identity */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-tertiary flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.3)] mb-6 group transition-transform hover:scale-105">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter text-on-surface uppercase text-center">
          FLASH PICK&nbsp;<span className="text-primary">MONITOR</span>
        </h1>
        <p className="font-label text-slate-500 text-xs tracking-widest uppercase mt-2">
          Precision Monitoring V2.4.0
        </p>
      </div>

      {/* Login Card */}
      <div className="glass-panel rounded-[3rem] p-8 lg:p-10 shadow-2xl">
        <div className="mb-8">
          <h2 className="text-xl font-headline font-bold text-white">System Access</h2>
          <p className="text-slate-400 text-sm mt-1">Authenticate to enter secure environment</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            type="email"
            variant="pill"
            size="lg"
            label="Terminal Identity"
            placeholder="admin@kinetic.local"
            required
            leadingIcon={<AtSign className="w-5 h-5" />}
          />

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="block font-label text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Access Key
              </label>
              <Button variant="link" size="sm" type="button" className="normal-case tracking-normal text-[10px]">
                Recovery Required?
              </Button>
            </div>
            <Input
              type={showPassword ? 'text' : 'password'}
              variant="pill"
              size="lg"
              placeholder="••••••••••••"
              required
              leadingIcon={<Key className="w-5 h-5" />}
              trailingIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 hover:text-white transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              }
            />
          </div>

          <Checkbox
            label="Maintain active session"
            checked={maintainSession}
            onChange={(e) => setMaintainSession(e.target.checked)}
          />

          <Button
            type="submit"
            variant="primary"
            size="pill"
            className="w-full"
          >
            Secure Sign In
            <ArrowRight className="w-5 h-5" />
          </Button>
        </form>

        {/* SSO Integration */}
        <div className="mt-8">
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <span className="relative px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] bg-[#0D1322]">
              Enterprise SSO
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button variant="ghost" size="pill" type="button" className="border border-white/5">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkWlMVeJLkzRFDpOep-awgPmViZV1wGVt-5G0YRBkKIhCFEerZDLpG8CMtxIF1ZIlyowGgH3zUzqazad1r-_x1KB_5q07zOAXIOnWYxOzh2KQiA5MYxX6-Us6O3t0eeMDLU4YCRPeYj5HF4xBszIGOeIxCdFYEgZgoofQrXL91tBpLiiKrAIQAr9csbDiJDFo9NHeahHNiId1yRd4K-1kj6lHE_z8y9xZOHByHlr2XXmEB3zQ-u8LpT4Wzz1LC4WzAgKpelsU_BFab"
                alt="Google"
                className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all"
              />
              <span className="text-xs font-semibold text-slate-300 normal-case tracking-normal">Identity</span>
            </Button>
            <Button variant="ghost" size="pill" type="button" className="border border-white/5">
              <Terminal className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              <span className="text-xs font-semibold text-slate-300 normal-case tracking-normal">LDAP</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
