"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/lib/admin/auth";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" name="email" type="email" autoComplete="username" required autoFocus />
      </Field>
      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      {state?.error && <FieldError>{state.error}</FieldError>}
      <Button type="submit" className="mt-2 w-full" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        <span>{pending ? "Signing in…" : "Sign in"}</span>
      </Button>
    </form>
  );
}
