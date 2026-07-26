"use server";

import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface NewsletterSignupResult {
  success: boolean;
  error?: string;
}

export async function subscribeToNewsletter(email: string): Promise<NewsletterSignupResult> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Newsletter signup is not configured yet." };
  }

  const supabase = getSupabaseServerClient();

  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: email.toLowerCase().trim() });

  // A unique-constraint violation just means they're already subscribed —
  // treat that as success rather than surfacing an error to the customer.
  if (error && error.code !== "23505") {
    return { success: false, error: "Something went wrong — please try again." };
  }

  return { success: true };
}
