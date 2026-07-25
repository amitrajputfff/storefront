"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type NewsletterValues = z.infer<typeof newsletterSchema>;

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground">
        <Check className="size-4 shrink-0" />
        <span>You&apos;re on the list. Watch your inbox.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <div className="flex-1">
        <Input
          type="email"
          placeholder="Your email address"
          aria-label="Email address"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="shrink-0">
        <span>{isSubmitting ? "Joining..." : "Sign up"}</span>
      </Button>
    </form>
  );
}
