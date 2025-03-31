import * as z from "zod";

const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const sinRegex = /^\d{9}$/;
const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
const zipCodeRegex = /^\d{5}(-\d{4})?$/;

export const formSchema = z.object({
  sin: z
    .string()
    .regex(sinRegex, "SIN must be exactly 9 digits")
    .refine((val) => {
      // Basic Luhn algorithm check for SIN validation
      const digits = val.split("").map(Number);
      let sum = 0;
      let isEven = false;

      for (let i = digits.length - 1; i >= 0; i--) {
        let digit = digits[i];

        if (isEven) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }

        sum += digit;
        isEven = !isEven;
      }

      return sum % 10 === 0;
    }, "Invalid SIN number"),
  confirmationNumber: z
    .string()
    .min(1, "Reference number is required")
    .max(32, "Reference number must not exceed 32 characters"),
  phoneNumber: z.string().regex(phoneRegex, "Invalid phone number format"),
  rentAmount: z.number().min(1, "Rent amount must be positive"),
  addressChanged: z.boolean(),
  newAddress: z
    .object({
      address1: z.string().min(1, "Address line 1 is required"),
      address2: z.string().optional(),
      city: z.string().min(1, "City is required"),
      provinceState: z.string().min(1, "Province/State is required"),
      postalZipCode: z
        .string()
        .refine((val) => postalCodeRegex.test(val) || zipCodeRegex.test(val), {
          message: "Invalid postal/zip code format",
        }),
      countryCode: z.string().min(2, "Country code is required"),
    })
    .nullable()
    .optional(),
  paymentDate: z
    .date()
    .min(
      new Date(new Date().setDate(new Date().getDate() - 30)),
      "Date cannot be more than 30 days ago"
    )
    .max(new Date(), "Date cannot be in the future"),
});

export const LoginFormSchema = z.object({
  username: z.string().min(2, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type FormValues = z.infer<typeof formSchema>;
export type LoginFormValues = z.infer<typeof LoginFormSchema>;
