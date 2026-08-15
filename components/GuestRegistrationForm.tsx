'use client';

import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { guestRegistrationSchema, GuestRegistrationFormData } from '@/lib/schemas/guestSchema';
import PrimaryGuestSection from './PrimaryGuestSection';
import CoGuestsSection from './CoGuestsSection';
import ForeignerSection from './ForeignerSection';
import SignatureSection from './SignatureSection';
import IdUploadSection from './IdUploadSection';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const getInitialArrivalDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

// Helper function to extract all error messages from nested FieldErrors
const extractErrorMessages = (errorsObj: any): string[] => {
  let messages: string[] = [];
  if (!errorsObj) return messages;
  if (typeof errorsObj === 'object') {
    if ('message' in errorsObj && typeof errorsObj.message === 'string' && errorsObj.message) {
      messages.push(errorsObj.message);
    } else {
      for (const key in errorsObj) {
        messages = messages.concat(extractErrorMessages(errorsObj[key]));
      }
    }
  }
  return messages;
};

export default function GuestRegistrationForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submittedRegId, setSubmittedRegId] = useState<string | null>(null);
  const [primaryGuestName, setPrimaryGuestName] = useState('');

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<GuestRegistrationFormData>({
    resolver: zodResolver(guestRegistrationSchema),
    mode: 'onTouched',
    defaultValues: {
      primaryGuest: {
        arrivalDateTime: getInitialArrivalDateTime(),
        fullName: '',
        age: '',
        gender: 'Male',
        nationality: 'Indian',
        fatherSpouseName: '',
        address: { streetAddress: '', city: '', state: '', pinCode: '', country: 'India' },
        travel: { arrivedFrom: '', goingTo: '', purposeOfVisit: 'Tourism', referralChannel: 'Google Search / Maps', referralDetails: '' },
        contact: { mobileNumber: '', phoneNumber: '', email: '' },
        vehicle: { driverName: '', carNumber: '' },
      },
      coGuests: [],
      foreignerDetails: {
        passportNo: '',
        dateOfIssue: '',
        placeOfIssue: '',
        restrictedAreaPermitNo: '',
        dateOfArrivalInIndia: '',
        employedInIndia: 'No',
        proposedDurationStay: '',
      },
      termsAccepted: true,
      signatureDataUrl: '',
      idImageUrl: '',
    },
  });

  const selectedNationality = useWatch({
    control,
    name: 'primaryGuest.nationality',
  });

  const signatureDataUrl = useWatch({
    control,
    name: 'signatureDataUrl',
  });

  const isForeigner = (selectedNationality || '').trim().toLowerCase() !== 'indian';

  const onSubmit = async (data: GuestRegistrationFormData) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/pms-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setSubmittedRegId(result.registrationId);
        setPrimaryGuestName(result.guestName);

        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#1F2937', '#D97757', '#ffffff'],
          });
        } catch (e) {
          // Fallback if confetti is blocked
        }
      } else {
        const err = await response.json();
        alert(`PMS Proxy Sync Failed: ${err.error || 'Check fields and try again'}`);
      }
    } catch (err) {
      alert('Network error communicating with Next.js PMS route handler.');
    } finally {
      setSubmitting(false);
    }
  };

  const onError = (invalidFields: any) => {
    console.log('Validation Error Details:', invalidFields);
    setTimeout(() => {
      const errorElement = document.querySelector('.border-red-500, [aria-invalid="true"]');
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleReset = () => {
    reset({
      primaryGuest: {
        arrivalDateTime: getInitialArrivalDateTime(),
        fullName: '',
        age: '',
        gender: 'Male',
        nationality: 'Indian',
        fatherSpouseName: '',
        address: { streetAddress: '', city: '', state: '', pinCode: '', country: 'India' },
        travel: { arrivedFrom: '', goingTo: '', purposeOfVisit: 'Tourism', referralChannel: 'Google Search / Maps', referralDetails: '' },
        contact: { mobileNumber: '', phoneNumber: '', email: '' },
        vehicle: { driverName: '', carNumber: '' },
      },
      coGuests: [],
      foreignerDetails: {
        passportNo: '',
        dateOfIssue: '',
        placeOfIssue: '',
        restrictedAreaPermitNo: '',
        dateOfArrivalInIndia: '',
        employedInIndia: 'No',
        proposedDurationStay: '',
      },
      termsAccepted: true,
      signatureDataUrl: '',
      idImageUrl: '',
    });
    setSubmittedRegId(null);
    setPrimaryGuestName('');
  };

  if (submittedRegId) {
    return (
      <Card className="text-center max-w-2xl mx-auto py-10 shadow-lg">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>

        <h2 className="text-3xl font-extrabold font-heading text-text-main mb-2">Check-In Registration Complete!</h2>
        <p className="text-text-muted font-body text-base mb-2">
          Welcome to Hotel Divine View, <strong className="text-primary">{primaryGuestName}</strong>.
        </p>
        <p className="text-text-muted font-body text-xs mb-6">
          Your guest intake form has been validated and synced with our Property Management System.
        </p>

        <div className="bg-background border border-gray-200 text-primary font-mono text-xl py-3 px-8 rounded-lg inline-block mb-6 tracking-wider shadow-sm">
          {submittedRegId}
        </div>

        <p className="text-xs text-text-muted font-body mb-8">
          Please show this reference number at reception to collect your room key card.
        </p>

        <Button type="button" variant="primary" size="lg" onClick={handleReset}>
          <RefreshCw className="w-5 h-5 mr-2" /> Start Registration for Next Guest
        </Button>
      </Card>
    );
  }

  const errorMessages = extractErrorMessages(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6 max-w-4xl mx-auto pb-16" noValidate>
      {errorMessages.length > 0 && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-5 text-red-800 font-body text-sm space-y-2 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2 font-bold text-red-900 text-base">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>Registration Form Incomplete — Please Fix The Following ({errorMessages.length}) Issues:</span>
          </div>
          <ul className="list-disc pl-7 space-y-1 font-semibold text-red-700 text-xs sm:text-sm">
            {errorMessages.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Primary Guest Section */}
      <PrimaryGuestSection control={control} register={register} errors={errors} setValue={setValue} />

      {/* Dynamic Co-Guests Section */}
      <CoGuestsSection control={control} register={register} errors={errors} setValue={setValue} />

      {/* Conditional Foreigner Section */}
      <ForeignerSection register={register} errors={errors} setValue={setValue} isForeigner={isForeigner} />


      {/* ID Upload Section */}
      <IdUploadSection 
        onImageCaptured={(base64) => setValue('idImageUrl', base64 || '', { shouldValidate: true })} 
        error={errors.idImageUrl?.message}
      />

      {/* Signature & Terms Section */}
      <SignatureSection register={register} errors={errors} setValue={setValue} signatureDataUrl={signatureDataUrl} />

      {/* Bottom Action Bar */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleReset}
          className="w-full sm:w-auto"
        >
          Reset Kiosk Form
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          {submitting ? (
            'Syncing to PMS Gateway...'
          ) : (
            <>
              <Send className="w-5 h-5 mr-2 flex-shrink-0" /> Complete Registration & Sync PMS
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
