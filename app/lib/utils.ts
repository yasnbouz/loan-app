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

export function calculateAmortizedLoan(principal: number, interestRate: number, termInMonths: number) {
  // Input validation for numerical values
  if (isNaN(principal) || isNaN(interestRate) || isNaN(termInMonths)) {
    return { error: "Invalid input: All values must be numbers." };
  }

  // Calculate monthly interest rate
  const monthlyInterestRate = interestRate / 100 / 12;

  // Calculate monthly payment using the PMT formula
  const payment = (principal * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -termInMonths));

  // Calculate total interest paid
  const totalInterest = payment * termInMonths - principal;

  const total = principal + totalInterest;
  return {
    monthlyPayment: new Intl.NumberFormat().format(payment),
    totalInterest: new Intl.NumberFormat().format(totalInterest),
    total: new Intl.NumberFormat().format(total),
  };
}
