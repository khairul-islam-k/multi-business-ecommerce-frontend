import currencyCodes from "currency-codes";
import { getTimeZones } from "@vvo/tzdb";

export const currencyOptions = currencyCodes.data
  .map((item) => ({
    label: `${item.code} - ${item.currency}`,
    value: item.code,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const countryOptions = currencyCodes
  .countries()
  .map((country) => ({
    label: country,
    value: country,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const timezoneOptions = getTimeZones()
  .map((timezone) => ({
    label: `${timezone.name} (${timezone.currentTimeFormat})`,
    value: timezone.name,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));
