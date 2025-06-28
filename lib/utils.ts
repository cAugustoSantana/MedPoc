import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "";

  // Remove any non-digit characters
  const digitsOnly = phone.replace(/\D/g, "");

  // Format as (xxx) xxx-xxxx
  return digitsOnly.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
}
