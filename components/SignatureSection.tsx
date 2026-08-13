'use client';

import React, { useRef, useState, useEffect } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { GuestRegistrationFormData } from '@/lib/schemas/guestSchema';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck, Eraser } from 'lucide-react';

interface SignatureSectionProps {
  register: UseFormRegister<GuestRegistrationFormData>;
  errors: FieldErrors<GuestRegistrationFormData>;
  setValue: UseFormSetValue<GuestRegistrationFormData>;
  signatureDataUrl?: string;
}

export default function SignatureSection({ register, errors, setValue, signatureDataUrl }: SignatureSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(Boolean(signatureDataUrl));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(2, 2);
    ctx.strokeStyle = '#1F2937';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (signatureDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = signatureDataUrl;
    }
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    if (!hasDrawn) setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      setValue('signatureDataUrl', dataUrl, { shouldValidate: true });
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setValue('signatureDataUrl', '', { shouldValidate: true });
  };

  const signatureError = errors.signatureDataUrl?.message;

  return (
    <Card className={`space-y-6 ${signatureError ? 'border-2 border-red-500 bg-red-50/10' : ''}`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg text-primary">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>Terms & Guest Signature</CardTitle>
            <CardDescription>Guest policy consent & digital signature capture</CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* Hotel Terms Box */}
      <div className="bg-background border border-gray-200 rounded-lg p-4 max-h-40 overflow-y-auto text-xs text-text-muted font-body leading-relaxed space-y-2">
        <h4 className="font-bold text-text-main font-heading text-sm">GUESTS TO PLEASE NOTE:</h4>
        <ol className="list-decimal pl-4 space-y-1.5">
          <li>
            <strong>Check-out Time:</strong> Standard check-out time is 11:00 AM. Late check-out requires prior approval from reception.
          </li>
          <li>
            <strong>Government Identity Verification:</strong> Guests must produce a valid physical government photo ID upon check-in. Foreign nationals must present a valid Passport & Visa.
          </li>
          <li>
            <strong>Valuables:</strong> Management is not liable for loss or damage to cash or valuables left unmonitored in guest rooms. In-room safes are provided.
          </li>
          <li>
            <strong>Prohibitions:</strong> Hazardous items, weapons, illegal substances, and non-designated smoking are strictly prohibited.
          </li>
        </ol>
      </div>

      {/* Terms Consent Checkbox */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="termsAccepted"
          {...register('termsAccepted')}
          className="w-5 h-5 text-primary accent-primary rounded cursor-pointer min-h-[20px] min-w-[20px]"
        />
        <label htmlFor="termsAccepted" className="text-sm font-body text-text-main cursor-pointer select-none">
          I have read and agree to the hotel rules, guest regulations, and identity consent.
        </label>
      </div>
      {errors.termsAccepted && (
        <span className="text-red-600 text-xs block font-semibold font-body">⚠️ {errors.termsAccepted.message}</span>
      )}

      {/* Signature Canvas */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className={`block text-xs font-semibold uppercase tracking-wider font-body ${signatureError ? 'text-red-700 font-bold' : 'text-text-muted'}`}>
            Signature of Primary Guest <span className="text-secondary">*</span>
          </label>
          {hasDrawn && <span className="text-xs text-emerald-600 font-semibold font-body">✓ Signature captured</span>}
        </div>

        <div
          className={`bg-white rounded-lg border-2 ${
            signatureError ? 'border-red-500 bg-red-50/30 ring-2 ring-red-500/20' : 'border-dashed border-gray-300'
          } relative h-44 overflow-hidden touch-none cursor-crosshair`}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full block"
          />
        </div>

        {signatureError && (
          <span className="text-red-600 text-xs mt-1 block font-semibold font-body">⚠️ {signatureError}</span>
        )}

        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-text-muted font-body">Sign inside the box using your finger, stylus, or mouse</span>
          <Button type="button" variant="outline" size="sm" onClick={clearCanvas}>
            <Eraser className="w-3.5 h-3.5 mr-1" /> Clear Signature
          </Button>
        </div>
      </div>
    </Card>
  );
}
