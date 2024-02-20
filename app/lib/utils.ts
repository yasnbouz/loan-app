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

export function calculateAmortizedLoan(principal: number, interestRate: number, termInYears: number) {
  // Input validation for numerical values
  if (isNaN(principal) || isNaN(interestRate) || isNaN(termInYears)) {
    return { error: "Invalid input: All values must be numbers." };
  }

  // Convert term to months
  const termInMonths = termInYears * 12;

  // Calculate monthly interest rate
  const monthlyInterestRate = interestRate / 100 / 12;

  // Calculate monthly payment using the PMT formula
  const payment = (principal * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -termInMonths));

  // Calculate total interest paid
  const totalInterest = payment * termInMonths - principal;

  const total = principal + totalInterest;
  return {
    monthlyPayment: payment.toFixed(2),
    totalInterest: totalInterest.toFixed(2),
    total: total.toFixed(2),
  };
}
