import { z } from "zod";
import { INDIAN_STATES } from "@/constants/india";

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Enter your full name")
    .regex(/^[A-Za-z\s.'-]+$/, "Name can only contain letters"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  address1: z.string().trim().min(5, "Enter your full address"),
  address2: z.string().trim().optional().or(z.literal("")),
  pincode: z.string().trim().regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit pincode"),
  city: z.string().trim().min(2, "Enter your city"),
  state: z.enum(INDIAN_STATES, { message: "Select your state" }),
  paymentMethod: z.enum(["cod", "online"]),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;

export const checkoutDefaultValues: CheckoutValues = {
  fullName: "",
  phone: "",
  email: "",
  address1: "",
  address2: "",
  pincode: "",
  city: "",
  state: "" as CheckoutValues["state"],
  paymentMethod: "cod",
};
