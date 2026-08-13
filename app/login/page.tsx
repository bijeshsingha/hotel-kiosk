'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, AlertCircle, KeyRound } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push(callbackUrl);
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid staff credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-gray-200">
      <CardHeader className="text-center pb-2">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-3">
          <Lock className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-extrabold font-heading text-text-main">
          Front Desk Portal Login
        </CardTitle>
        <CardDescription>
          Enter hotel staff credentials to access the administrative dashboard
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleLogin} className="space-y-4 pt-2">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1">
          <Input
            type="text"
            label="Staff Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin"
            required
          />
        </div>

        <div className="space-y-1">
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <div className="pt-2">
          <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading}>
            <KeyRound className="w-4 h-4 mr-2" />
            {loading ? 'Authenticating Staff...' : 'Login to Front Desk Admin'}
          </Button>
        </div>

        <div className="bg-slate-50 border border-gray-200 rounded-lg p-3 text-center text-xs text-text-muted font-body mt-4">
          <span className="font-semibold text-text-main">Default Demo Credentials:</span>
          <br />
          Username: <code className="font-mono text-primary bg-gray-200 px-1 py-0.5 rounded">admin</code> | Password: <code className="font-mono text-primary bg-gray-200 px-1 py-0.5 rounded">admin123</code>
        </div>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Suspense fallback={<div className="text-text-muted font-body text-sm">Loading staff login...</div>}>
        <LoginFormContent />
      </Suspense>
    </main>
  );
}
