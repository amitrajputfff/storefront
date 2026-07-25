"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const contactSchema = z.object({
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const SUBJECTS = [
  { value: "order", label: "Order Support" },
  { value: "product", label: "Product Question" },
  { value: "press", label: "Press" },
  { value: "other", label: "Other" },
];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border p-8">
        <CheckCircle2 className="text-success size-8" />
        <h3 className="text-lg font-medium">Message sent</h3>
        <p className="text-muted-foreground text-sm">
          Thanks for reaching out — we&apos;ll get back to you within 1 business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && (
            <p className="text-error text-xs">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email && (
            <p className="text-error text-xs">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Controller
          control={control}
          name="subject"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="subject" className="w-full">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.subject && (
          <p className="text-error text-xs">{errors.subject.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={5} {...register("message")} aria-invalid={!!errors.message} />
        {errors.message && (
          <p className="text-error text-xs">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
      </Button>
    </form>
  );
}
