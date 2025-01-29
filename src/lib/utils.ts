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

export function removeFormat(value: string) {
  return value.replace(/\D/g, ""); // Remove todos os não dígitos
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

export function formatCPF(value: string) {
  return value
    .replace(/\D/g, "") // Remove tudo que não é dígito
    .replace(/^(\d{3})(\d)/, "$1.$2") // Adiciona ponto após os três primeiros dígitos
    .replace(/^(\d{3}\.\d{3})(\d)/, "$1.$2") // Adiciona ponto após o sexto dígito
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Adiciona hífen nos dois últimos dígitos
}

export function formatRG(value: string) {
  return value
    .replace(/\D/g, "") // Remove tudo que não é dígito
    .replace(/^(\d{2})(\d)/, "$1.$2") // Adiciona ponto após os dois primeiros dígitos
    .replace(/^(\d{2}\.\d{3})(\d)/, "$1.$2") // Adiciona ponto após o quinto dígito
    .replace(/(\d{3})(\d{1})$/, "$1-$2"); // Adiciona hífen no último dígito
}

export function formatPhoneNumber(value: string) {
  return value
    .replace(/\D/g, "") // Remove tudo que não é dígito
    .replace(/^(\d{2})(\d)/, "($1) $2") // Adiciona parênteses ao DDD
    .replace(/(\d{4})(\d{1,4})$/, "$1-$2") // Adiciona o hífen após 4 dígitos (para números intermediários)
    .replace(/(\d{5})(\d{4})$/, "$1-$2") // Ajusta o hífen para números com 11 dígitos
    .replace(/(-\d{4})\d+?$/, "$1"); // Limita a 11 dígitos no total
}

export function formatDate(value: string | Date) {
  let valueStr: string = "";

  if (typeof value !== "string") {
    const valueDateISO = new Date(value);
    const valueDate = new Date(
      valueDateISO.getUTCFullYear(),
      valueDateISO.getUTCMonth(),
      valueDateISO.getUTCDate()
    );

    valueStr = new Date(valueDate).toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  } else valueStr = value;

  return valueStr
    .replace(/\D/g, "") // Remove tudo que não é dígito
    .replace(/^(\d{2})(\d)/, "$1/$2") // Adiciona a barra após o segundo dígito (dia)
    .replace(/^(\d{2}\/\d{2})(\d)/, "$1/$2") // Adiciona a barra após o quinto dígito (mês)
    .slice(0, 10); // Limita o tamanho para "DD/MM/AAAA"
}

export function getInquiryCode(data: {
  requestDate: Date;
  code: number;
}): string {
  const requestDateISO = new Date(data.requestDate);

  const inquiryCode: string = `${String(
    requestDateISO.getUTCFullYear()
  )}${String(requestDateISO.getUTCMonth() + 1).padStart(2, "0")}${String(
    requestDateISO.getUTCDate()
  ).padStart(2, "0")}-${String(data.code).padStart(6, "0")}`;

  return inquiryCode;
}
