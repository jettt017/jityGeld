import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function serializeData<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return obj; // Next.js supports Date
  }

  // Check for Prisma.Decimal via duck typing (has toNumber method)
  if ("toNumber" in obj && typeof (obj as any).toNumber === "function") {
    return (obj as any).toNumber();
  }

  if (Array.isArray(obj)) {
    return obj.map(item => serializeData(item)) as unknown as T;
  }

  const serialized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    serialized[key] = serializeData(value);
  }
  
  return serialized as T;
}
