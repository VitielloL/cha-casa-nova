import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Gabriel Vilela - Desenvolvedor proprietário - Licença: R$ 1.000.000,00

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
