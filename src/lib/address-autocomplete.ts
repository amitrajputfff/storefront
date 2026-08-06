"use server";

export interface AddressSuggestion {
  label: string;
  address1: string;
  city: string;
  state: string;
  pincode: string;
}

interface NominatimResult {
  name?: string;
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    suburb?: string;
    neighbourhood?: string;
    quarter?: string;
    city_district?: string;
    city?: string;
    town?: string;
    municipality?: string;
    village?: string;
    county?: string;
    state_district?: string;
    state?: string;
    postcode?: string;
  };
}

/** Free, keyless address search (OpenStreetMap Nominatim) scoped to India — used to
 * offer real matching addresses as the shopper types, instead of a blank text field. */
export async function searchAddress(query: string): Promise<AddressSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 4) return [];

  try {
    const params = new URLSearchParams({
      format: "jsonv2",
      addressdetails: "1",
      countrycodes: "in",
      limit: "5",
      q: trimmed,
    });

    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: {
        "User-Agent": `Zeevara-Storefront/1.0 (${process.env.SHOPIFY_STORE_DOMAIN ?? "storefront"})`,
      },
      next: { revalidate: 60 * 60 },
    });

    if (!res.ok) return [];

    const results = (await res.json()) as NominatimResult[];

    return results
      .map((result) => {
        const { address } = result;
        // Named places (e.g. "Omaxe New Heights") live in `name`, separate from the
        // road — combine both so the building/society name isn't dropped.
        const street = [address.house_number, address.road].filter(Boolean).join(" ");
        const namedPlace = result.name && result.name !== street ? result.name : undefined;
        const address1 =
          [namedPlace, street].filter(Boolean).join(", ") ||
          address.suburb ||
          address.neighbourhood ||
          "";
        // India's OSM tagging is inconsistent about what counts as "city" (often a
        // sector/locality ends up there) — take the broadest plausible match; the
        // pincode lookup that follows re-derives the authoritative city/state anyway.
        const city =
          address.city ||
          address.town ||
          address.municipality ||
          address.county ||
          address.state_district ||
          address.village ||
          "";

        return {
          label: result.display_name,
          address1,
          city,
          state: address.state ?? "",
          pincode: address.postcode ?? "",
        };
      })
      .filter((suggestion) => suggestion.address1);
  } catch {
    return [];
  }
}
