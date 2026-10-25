"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";

export default function DonationPicker({ locale }: { locale: Locale }) {
  const [amount, setAmount] = useState(9);
  const format = (value: number) => new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
  return <div>
    <p>{locale === "fr" ? "Une suggestion de contribution, selon vos moyens :" : "A suggested contribution, according to your means:"}</p>
    <div className="marketing-donations" role="group" aria-label={locale === "fr" ? "Montant suggéré" : "Suggested amount"}>{[3, 9, 15, 30].map((value) => <button key={value} type="button" aria-pressed={amount === value} onClick={() => setAmount(value)}>{format(value)}</button>)}</div>
    <p aria-live="polite">{locale === "fr" ? `Suggestion : ${format(amount)}. Vous choisirez le montant définitif sur Ko-fi.` : `Suggestion: ${format(amount)}. Choose the final amount on Ko-fi.`}</p>
    <a className="btn-primary" href="https://ko-fi.com/fantasmaglad" rel="noreferrer">{locale === "fr" ? "Continuer sur Ko-fi" : "Continue on Ko-fi"}</a>
  </div>;
}
