import { z } from 'zod';

export const addressSchema = z.object({
  streetAddress: z.string().optional().default(''),
  city: z.string().optional().default(''),
  state: z.string().optional().default(''),
  pinCode: z.string().optional().default(''),
  country: z.string().optional().default('India'),
});

export const travelSchema = z.object({
  arrivedFrom: z.string().optional().default(''),
  goingTo: z.string().optional().default(''),
  purposeOfVisit: z.string().optional().default('Tourism'),
  referralChannel: z
    .enum([
      'Cab / Auto / Rickshaw Driver',
      'Google Search / Maps',
      'Recommendation / Word of Mouth',
      'Hotel Booking Website (OTA)',
      'Social Media',
      'Walk-In / Direct',
      'Other',
    ])
    .default('Google Search / Maps'),
  referralDetails: z.string().optional().default(''),
});

export const contactSchema = z.object({
  mobileNumber: z.string().min(5, 'Primary mobile number is required'),
  phoneNumber: z.string().optional().default(''),
  email: z
    .string()
    .optional()
    .default('')
    .refine((val) => !val || val.trim() === '' || z.string().email().safeParse(val).success, {
      message: 'Invalid email address format',
    }),
});

export const vehicleSchema = z.object({
  driverName: z.string().optional().default(''),
  carNumber: z.string().optional().default(''),
});

export const coGuestSchema = z.object({
  fullName: z.string().min(1, 'Co-guest name is required'),
  age: z.string().optional().default(''),
  gender: z.enum(['Male', 'Female', 'Other']).default('Male'),
  relation: z.string().optional().default('Spouse'),
});

export const foreignerDetailsSchema = z.object({
  passportNo: z.string().optional().default(''),
  dateOfIssue: z.string().optional().default(''),
  placeOfIssue: z.string().optional().default(''),
  restrictedAreaPermitNo: z.string().optional().default(''),
  dateOfArrivalInIndia: z.string().optional().default(''),
  employedInIndia: z.enum(['Yes', 'No']).default('No'),
  proposedDurationStay: z.string().optional().default(''),
});

export const guestRegistrationSchema = z
  .object({
    primaryGuest: z.object({
      arrivalDateTime: z.string().min(1, 'Arrival date & time is required'),
      fullName: z.string().min(2, 'Full name in block letters is required'),
      age: z.string().min(1, 'Age is required'),
      gender: z.enum(['Male', 'Female', 'Other']).default('Male'),
      nationality: z.string().default('Indian'),
      fatherSpouseName: z.string().optional().default(''),
      roomNumber: z.string().optional().default(''),
      address: addressSchema,
      travel: travelSchema,
      contact: contactSchema,
      vehicle: vehicleSchema,
    }),
    coGuests: z.array(coGuestSchema).default([]),
    foreignerDetails: foreignerDetailsSchema.optional().nullable(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: 'You must accept hotel terms and conditions',
    }),
    signatureDataUrl: z.string().min(10, 'Digital signature is required'),
  idImageUrl: z.string().optional().default(''),
  })
  .superRefine((data, ctx) => {
    const isForeigner = (data.primaryGuest.nationality || '').trim().toLowerCase() !== 'indian';
    if (isForeigner) {
      if (
        !data.foreignerDetails ||
        !data.foreignerDetails.passportNo ||
        data.foreignerDetails.passportNo.trim().length < 2
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['foreignerDetails', 'passportNo'],
          message: 'Passport number is mandatory for foreign nationals',
        });
      }
    }
  });

export type GuestRegistrationFormData = z.infer<typeof guestRegistrationSchema>;
