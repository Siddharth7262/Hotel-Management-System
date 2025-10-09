import { z } from "zod";

// Security: Input validation schemas to prevent injection attacks
export const roomSchema = z.object({
  room_number: z.string()
    .trim()
    .min(1, "Room number is required")
    .max(10, "Room number must be less than 10 characters")
    .regex(/^[a-zA-Z0-9-]+$/, "Room number can only contain letters, numbers, and hyphens"),
  type: z.string()
    .trim()
    .min(1, "Room type is required")
    .max(50, "Room type must be less than 50 characters"),
  floor: z.coerce.number()
    .int("Floor must be an integer")
    .min(1, "Floor must be at least 1")
    .max(100, "Floor must be less than 100"),
  capacity: z.coerce.number()
    .int("Capacity must be an integer")
    .min(1, "Capacity must be at least 1")
    .max(20, "Capacity must be less than 20"),
  price: z.coerce.number()
    .positive("Price must be positive")
    .max(100000, "Price must be less than 100,000"),
  status: z.enum(["available", "occupied", "maintenance"], {
    required_error: "Status is required"
  })
});

export const guestSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase(),
  phone: z.string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^[+\d\s()-]+$/, "Invalid phone number format"),
  status: z.enum(["active", "inactive"], {
    required_error: "Status is required"
  })
});

export const bookingSchema = z.object({
  guest_id: z.string()
    .uuid("Invalid guest ID"),
  room_id: z.string()
    .uuid("Invalid room ID"),
  check_in: z.string()
    .min(1, "Check-in date is required"),
  check_out: z.string()
    .min(1, "Check-out date is required"),
  total_amount: z.coerce.number()
    .positive("Total amount must be positive")
    .max(1000000, "Total amount must be less than 1,000,000"),
  status: z.enum(["confirmed", "pending", "cancelled", "completed"], {
    required_error: "Status is required"
  })
}).refine((data) => {
  const checkIn = new Date(data.check_in);
  const checkOut = new Date(data.check_out);
  return checkOut > checkIn;
}, {
  message: "Check-out date must be after check-in date",
  path: ["check_out"]
});

export const authSchema = z.object({
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
});

export type RoomInput = z.infer<typeof roomSchema>;
export type GuestInput = z.infer<typeof guestSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type AuthInput = z.infer<typeof authSchema>;
