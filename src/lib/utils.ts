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

export function formatCNPJ(value: string) {
  return value
    .replace(/\D/g, "") // Remove tudo que não é dígito
    .replace(/^(\d{2})(\d)/, "$1.$2") // Adiciona ponto após os dois primeiros dígitos
    .replace(/^(\d{2}\.\d{3})(\d)/, "$1.$2") // Adiciona ponto após o quinto dígito
    .replace(/\.(\d{3})(\d)/, ".$1/$2") // Adiciona barra após o oitavo dígito
    .replace(/(\d{4})(\d)/, "$1-$2") // Adiciona hífen após o décimo segundo dígito
    .replace(/(-\d{2})\d+?$/, "$1"); // Limita a 14 caracteres (00.000.000/0000-00)
}
export function removerFormat(value: string) {
  return value.replace(/\D/g, ""); // Remove todos os não dígitos
}
