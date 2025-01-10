import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const durationToast: number = 2000;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function dateStringToDateUTC(dateStr: string) {
  const parts = dateStr.split("-");
  const dateUTC = new Date(
    Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
  );

  return dateUTC;
}
