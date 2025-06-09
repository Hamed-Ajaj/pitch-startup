import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-Us", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export function parseServerActionRes<T>(res: T) {
  return JSON.parse(JSON.stringify(res));
}
