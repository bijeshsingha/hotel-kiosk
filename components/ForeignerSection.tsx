'use client';

import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { GuestRegistrationFormData } from '@/lib/schemas/guestSchema';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface ForeignerSectionProps {
  register: UseFormRegister<GuestRegistrationFormData>;
  errors: FieldErrors<GuestRegistrationFormData>;
  setValue: UseFormSetValue<GuestRegistrationFormData>;
  isForeigner: boolean;
}

export default function ForeignerSection({ register, errors, setValue, isForeigner }: ForeignerSectionProps) {
  if (!isForeigner) return null;

  return (
    <Card className="border-secondary/30 bg-secondary/5">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-secondary/15 rounded-lg text-secondary">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <CardTitle>Foreigner Details</CardTitle>
              <span className="bg-secondary text-white font-bold text-[10px] tracking-wider px-2 py-0.5 rounded uppercase">
                Government Form-C
              </span>
            </div>
            <CardDescription>Compliance details for non-Indian passport holders</CardDescription>
          </div>
        </div>
      </CardHeader>

      <div className="grid grid-cols-12 gap-6">
        {/* Passport Number */}
        <div className="col-span-12 sm:col-span-6">
          <Input
            type="text"
            label="Passport Number"
            requiredStar
            placeholder="e.g. A12345678"
            error={errors.foreignerDetails?.passportNo?.message}
            {...register('foreignerDetails.passportNo')}
            onChange={(e) => setValue('foreignerDetails.passportNo', e.target.value.toUpperCase())}
            className="uppercase tracking-wide font-medium"
          />
        </div>

        {/* Date of Issue */}
        <div className="col-span-6 sm:col-span-3">
          <Input type="date" label="Date of Issue" {...register('foreignerDetails.dateOfIssue')} />
        </div>

        {/* Place of Issue */}
        <div className="col-span-6 sm:col-span-3">
          <Input type="text" label="Place of Issue" placeholder="City / Country" {...register('foreignerDetails.placeOfIssue')} />
        </div>

        {/* Restricted Area Permit No. */}
        <div className="col-span-12 sm:col-span-6">
          <Input
            type="text"
            label="Restricted Area Permit (RAP) No."
            placeholder="Permit / Visa reference number"
            {...register('foreignerDetails.restrictedAreaPermitNo')}
          />
        </div>

        {/* Date of Arrival in India */}
        <div className="col-span-12 sm:col-span-6">
          <Input type="date" label="Date of Arrival in India" {...register('foreignerDetails.dateOfArrivalInIndia')} />
        </div>

        {/* Whether Employed in India */}
        <div className="col-span-6 sm:col-span-6">
          <Select label="Employed in India?" {...register('foreignerDetails.employedInIndia')}>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </Select>
        </div>

        {/* Proposed Duration of Stay in India */}
        <div className="col-span-6 sm:col-span-6">
          <Input
            type="text"
            label="Proposed Stay Duration"
            placeholder="e.g. 14 Days / 3 Months"
            {...register('foreignerDetails.proposedDurationStay')}
          />
        </div>
      </div>
    </Card>
  );
}
