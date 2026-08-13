'use client';

import React from 'react';
import GuestRegistrationForm from '@/components/GuestRegistrationForm';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function CheckInKioskPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Kiosk Tablet Header */}
      <header className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/15 border border-secondary/30 text-secondary text-xs font-bold uppercase tracking-widest mb-3 font-body">
          <Sparkles className="w-3.5 h-3.5" /> Guest Self-Service Kiosk
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main tracking-tight font-heading mb-2">
          HOTEL DIVINE VIEW
        </h1>
        <p className="text-text-muted text-sm sm:text-base font-body">
          Digital Guest Registration & Intake Form
        </p>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-text-muted font-body">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted Local & PMS Gateway Session</span>
        </div>
      </header>

      {/* Guest Intake Kiosk Form */}
      <GuestRegistrationForm />
    </main>
  );
}
