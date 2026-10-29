import { ADDRESSES, PRICE_UNITS } from "@/lib/constants";

export type ProfileField =
  | "serviceId" | "address" | "headline" | "bio" | "priceFrom" | "priceUnit";

export function validateProfile(v: Record<ProfileField, string>) {
  const errors: Partial<Record<ProfileField, string>> = {};
  const price = Number(v.priceFrom);

  if (!v.serviceId) errors.serviceId = "Choose your service.";
  if (!(ADDRESSES as readonly string[]).includes(v.address)) errors.address = "Choose your area.";
  if (v.headline.length < 5 || v.headline.length > 80) errors.headline = "Headline must be 5 to 80 characters.";
  if (v.bio.length < 20 || v.bio.length > 600) errors.bio = "Bio must be 20 to 600 characters.";
  if (!Number.isInteger(price) || price < 50 || price > 100000) errors.priceFrom = "Enter a whole price between 50 and 100,000 ETB.";
  if (!(PRICE_UNITS as readonly string[]).includes(v.priceUnit)) errors.priceUnit = "Choose a unit.";

  return { errors, price };
}