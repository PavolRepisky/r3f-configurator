import { CURRENCIES } from "@/data/currency";
import type { CurrencyCode } from "@/types/configurator";

export function formatPrice(
  basePriceInEur: number,
  currencyCode: CurrencyCode,
) {
  const currency = CURRENCIES[currencyCode];
  const convertedValue = basePriceInEur * currency.rate;

  // Use Intl.NumberFormat for professional formatting
  const formatter = new Intl.NumberFormat(
    currencyCode === "CZK" ? "cs-CZ" : "en-US",
    {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  );

  const formattedNumber = formatter.format(convertedValue);

  // Custom positioning of symbols
  if (currencyCode === "EUR") return `€ ${formattedNumber}`;
  if (currencyCode === "USD") return `$${formattedNumber}`;
  if (currencyCode === "CZK") return `${formattedNumber} Kč`;

  return `${formattedNumber} ${currency.symbol}`;
}
