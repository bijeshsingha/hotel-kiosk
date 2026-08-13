'use client';

import React from 'react';
import { Control, UseFormRegister, useFieldArray, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { GuestRegistrationFormData } from '@/lib/schemas/guestSchema';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Users, Plus, Trash2 } from 'lucide-react';

interface CoGuestsSectionProps {
  control: Control<GuestRegistrationFormData>;
  register: UseFormRegister<GuestRegistrationFormData>;
  errors: FieldErrors<GuestRegistrationFormData>;
  setValue: UseFormSetValue<GuestRegistrationFormData>;
}

export default function CoGuestsSection({ control, register, errors, setValue }: CoGuestsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'coGuests',
  });

  const handleAddGuest = () => {
    append({
      fullName: '',
      age: '',
      gender: 'Male',
      relation: 'Spouse',
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-lg text-primary flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>Other Pax ({fields.length})</CardTitle>
            <CardDescription>Accompanying co-guests staying in the room</CardDescription>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleAddGuest}
          className="w-full sm:w-auto whitespace-nowrap mt-2 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add Guest
        </Button>
      </CardHeader>

      {fields.length === 0 ? (
        <div className="text-center py-8 text-text-muted border border-dashed border-gray-200 rounded-lg">
          <p className="mb-3 text-sm font-body">No co-guests added yet.</p>
          <Button type="button" variant="outline" size="sm" onClick={handleAddGuest}>
            <Plus className="w-4 h-4 mr-1.5" /> Add accompanying guest
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-background border border-gray-200 p-4 rounded-lg space-y-4 shadow-sm"
            >
              {/* Card Top Sub-Header */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="font-heading font-bold text-sm text-primary">
                  Co-Guest #{index + 1}
                </span>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors py-1 px-3 min-h-[36px]"
                  title="Remove Guest"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1 text-red-600" /> Remove
                </Button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-12 gap-3 sm:gap-4">
                {/* Full Name */}
                <div className="col-span-12 sm:col-span-5">
                  <Input
                    label="Full Name"
                    placeholder="CO-GUEST FULL NAME"
                    error={errors.coGuests?.[index]?.fullName?.message}
                    {...register(`coGuests.${index}.fullName`)}
                    onChange={(e) => {
                      setValue(`coGuests.${index}.fullName`, e.target.value.toUpperCase());
                    }}
                    className="uppercase tracking-wide font-medium"
                  />
                </div>

                {/* Age */}
                <div className="col-span-4 sm:col-span-2">
                  <Input
                    type="number"
                    min="0"
                    max="120"
                    label="Age"
                    placeholder="Age"
                    {...register(`coGuests.${index}.age`)}
                  />
                </div>

                {/* Gender */}
                <div className="col-span-8 sm:col-span-2">
                  <Select label="Gender" {...register(`coGuests.${index}.gender`)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>

                {/* Relation */}
                <div className="col-span-12 sm:col-span-3">
                  <Select label="Relation" {...register(`coGuests.${index}.relation`)}>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
