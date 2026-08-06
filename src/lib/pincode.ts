"use server";

export type PincodeLookupResult =
  | { valid: true; city: string; state: string }
  | { valid: false };

interface PostOffice {
  Name: string;
  District: string;
  State: string;
}

interface PincodeApiResponse {
  Status: string;
  PostOffice: PostOffice[] | null;
}

/** Looks up city/state for an Indian PIN code via the free India Post directory API. */
export async function lookupPincode(pincode: string): Promise<PincodeLookupResult> {
  if (!/^[1-9]\d{5}$/.test(pincode)) {
    return { valid: false };
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      cache: "force-cache",
      next: { revalidate: 60 * 60 * 24 * 30 },
    });

    if (!res.ok) return { valid: false };

    const data = (await res.json()) as PincodeApiResponse[];
    const office = data[0]?.PostOffice?.[0];

    if (data[0]?.Status !== "Success" || !office) {
      return { valid: false };
    }

    return { valid: true, city: office.District, state: office.State };
  } catch {
    return { valid: false };
  }
}
