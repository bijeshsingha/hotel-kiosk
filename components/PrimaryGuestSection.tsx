'use client';

import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, useWatch, Control } from 'react-hook-form';
import { GuestRegistrationFormData } from '@/lib/schemas/guestSchema';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { User, MapPin, Compass, Phone, Share2 } from 'lucide-react';

interface PrimaryGuestSectionProps {
  control?: Control<GuestRegistrationFormData>;
  register: UseFormRegister<GuestRegistrationFormData>;
  errors: FieldErrors<GuestRegistrationFormData>;
  setValue: UseFormSetValue<GuestRegistrationFormData>;
}

export default function PrimaryGuestSection({ control, register, errors, setValue }: PrimaryGuestSectionProps) {
  const selectedReferralChannel = useWatch({
    control,
    name: 'primaryGuest.travel.referralChannel',
  });

  const showDriverDetails = selectedReferralChannel === 'Cab / Auto / Rickshaw Driver';
  const showOtherDetails = selectedReferralChannel === 'Other';

  return (
    <div className="space-y-6">
      {/* 1. Primary Guest Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <User className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Primary Guest Details</CardTitle>
              <CardDescription>Personal identification & check-in credentials</CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-6">
            <Input
              type="datetime-local"
              label="Arrival Date & Time"
              requiredStar
              error={errors.primaryGuest?.arrivalDateTime?.message}
              {...register('primaryGuest.arrivalDateTime')}
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Input
              type="text"
              label="Full Name (Block Letters)"
              requiredStar
              placeholder="e.g. ROBERT JOHN SMITH"
              error={errors.primaryGuest?.fullName?.message}
              {...register('primaryGuest.fullName')}
              onChange={(e) => {
                setValue('primaryGuest.fullName', e.target.value.toUpperCase());
              }}
              className="uppercase tracking-wide font-medium"
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <Input
              type="number"
              min="1"
              max="120"
              label="Age"
              requiredStar
              placeholder="35"
              error={errors.primaryGuest?.age?.message}
              {...register('primaryGuest.age')}
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <Select label="Gender" {...register('primaryGuest.gender')}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Select label="Nationality" requiredStar {...register('primaryGuest.nationality')}>
              <option value="Indian">Indian</option>
              <option value="American">American (USA)</option>
              <option value="British">British (UK)</option>
              <option value="German">German</option>
              <option value="French">French</option>
              <option value="Australian">Australian</option>
              <option value="Canadian">Canadian</option>
              <option value="Japanese">Japanese</option>
              <option value="Other">Other Foreigner</option>
            </Select>
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Input
              type="text"
              label="Father / Spouse Name"
              placeholder="Full Name of Father or Spouse"
              {...register('primaryGuest.fatherSpouseName')}
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Input
              type="text"
              label="Room Number (If Pre-Assigned)"
              placeholder="e.g. 304 (Staff can also assign at Front Desk)"
              {...register('primaryGuest.roomNumber')}
            />
          </div>
        </div>
      </Card>

      {/* 2. Residential Address */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Residential Address</CardTitle>
              <CardDescription>Permanent residential address</CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <Input
              type="text"
              label="Street Address"
              placeholder="House / Flat No., Building, Street"
              {...register('primaryGuest.address.streetAddress')}
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Input type="text" label="City" placeholder="City / Town" {...register('primaryGuest.address.city')} />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Input type="text" label="PIN / Zip Code" placeholder="110001" {...register('primaryGuest.address.pinCode')} />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Input type="text" label="State" placeholder="State / Province" {...register('primaryGuest.address.state')} />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Input type="text" label="Country" placeholder="Country" {...register('primaryGuest.address.country')} />
          </div>
        </div>
      </Card>

      {/* 3. Travel & Acquisition Channel */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Travel & Referral Channel</CardTitle>
              <CardDescription>Journey details and how you discovered our hotel</CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-4">
            <Input type="text" label="Arrived From" placeholder="City arrived from" {...register('primaryGuest.travel.arrivedFrom')} />
          </div>

          <div className="col-span-12 sm:col-span-4">
            <Input type="text" label="Going To" placeholder="Next destination" {...register('primaryGuest.travel.goingTo')} />
          </div>

          <div className="col-span-12 sm:col-span-4">
            <Select label="Purpose of Visit" {...register('primaryGuest.travel.purposeOfVisit')}>
              <option value="Tourism">Tourism / Holiday</option>
              <option value="Business">Business / Conference</option>
              <option value="Official">Official / Govt Work</option>
              <option value="Leisure">Medical / Wellness</option>
              <option value="Transit">Transit / Layover</option>
            </Select>
          </div>

          {/* Acquisition / Referral Channel */}
          <div className="col-span-12 sm:col-span-6">
            <Select label="How Did You Hear About Us?" {...register('primaryGuest.travel.referralChannel')}>
              <option value="Cab / Auto / Rickshaw Driver">🚖 Cab / Auto / Rickshaw Driver</option>
              <option value="Google Search / Maps">🔍 Google Search / Maps</option>
              <option value="Recommendation / Word of Mouth">🤝 Recommendation / Word of Mouth (Friend/Family)</option>
              <option value="Hotel Booking Website (OTA)">🏨 Hotel Booking Website (MakeMyTrip, Booking, etc.)</option>
              <option value="Social Media">📱 Social Media (Instagram / Facebook)</option>
              <option value="Walk-In / Direct">🚶 Walk-In / Direct</option>
              <option value="Other">✨ Other Channel</option>
            </Select>
          </div>

          {showDriverDetails && (
            <div className="col-span-12 sm:col-span-6 animate-fadeIn">
              <Input
                type="text"
                label="Driver Name / Cab Company / Auto Vehicle No."
                placeholder="e.g. Ramesh Cab / DL 1T 5678 (Optional)"
                {...register('primaryGuest.travel.referralDetails')}
              />
            </div>
          )}

          {showOtherDetails && (
            <div className="col-span-12 sm:col-span-6 animate-fadeIn">
              <Input
                type="text"
                label="Specify How You Found Us"
                placeholder="e.g. Newspaper, Event, Billboard"
                {...register('primaryGuest.travel.referralDetails')}
              />
            </div>
          )}
        </div>
      </Card>

      {/* 4. Contact & Vehicle Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Contact & Vehicle Info</CardTitle>
              <CardDescription>Communication details & vehicle identification</CardDescription>
            </div>
          </div>
        </CardHeader>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-6">
            <Input
              type="tel"
              label="Mobile Number"
              requiredStar
              placeholder="+91 98765 43210"
              error={errors.primaryGuest?.contact?.mobileNumber?.message}
              {...register('primaryGuest.contact.mobileNumber')}
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Input
              type="tel"
              label="Alternate Phone / Landline"
              placeholder="Landline number"
              {...register('primaryGuest.contact.phoneNumber')}
            />
          </div>

          <div className="col-span-12">
            <Input
              type="email"
              label="Email Address"
              placeholder="guest@example.com"
              error={errors.primaryGuest?.contact?.email?.message}
              {...register('primaryGuest.contact.email')}
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Input
              type="text"
              label="Driver Name (If Any)"
              placeholder="Driver's Full Name"
              {...register('primaryGuest.vehicle.driverName')}
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <Input
              type="text"
              label="Car / Vehicle Number"
              placeholder="e.g. DL 01 AB 1234"
              {...register('primaryGuest.vehicle.carNumber')}
              onChange={(e) => setValue('primaryGuest.vehicle.carNumber', e.target.value.toUpperCase())}
              className="uppercase tracking-wide font-medium"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
