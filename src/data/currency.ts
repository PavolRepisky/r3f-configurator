import type { Currency, CurrencyCode } from "@/types/configurator";

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  EUR: {
    code: "EUR",
    label: "Euro",
    symbol: "€",
    rate: 1,
  },
  USD: {
    code: "USD",
    label: "US Dollar",
    symbol: "$",
    rate: 1.08,
  },
  CZK: {
    code: "CZK",
    label: "Česká koruna",
    symbol: "Kč",
    rate: 25.3,
  },
};

export const DEFAULT_CURRENCY: CurrencyCode = "EUR";
