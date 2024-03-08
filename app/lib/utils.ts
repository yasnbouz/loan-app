import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(value);
};

export function calculateLoan(principal: number, interestRate: number, months: number) {
  // Calculate the monthly payment
  const monthlyPayment = (principal * interestRate * Math.pow(1 + interestRate, months)) / (Math.pow(1 + interestRate, months) - 1);

  // calculate total interest paid
  const totalinterest = monthlyPayment * months - principal;

  // total loan

  const total = principal + totalinterest;
  const parsed = {
    monthlyPayment: Number(monthlyPayment).toFixed(2),
    totalinterest: Number(totalinterest).toFixed(2),
    total: Number(total).toFixed(2),
  };
  return {
    monthlyPayment: new Intl.NumberFormat().format(+parsed.monthlyPayment),
    totalInterest: new Intl.NumberFormat().format(+parsed.totalinterest),
    total: new Intl.NumberFormat().format(+parsed.total),
  };
}
