import { FormSection } from "@/components/admin/fields/form-section";
import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, SITE_URL } from "@/constants/site";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Site Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Contact details live on the Contact page editor.</p>
      </div>

      <FormSection title="Site details" description="These are set in code and shared across metadata, sitemaps, and structured data — contact your developer to change them.">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">Name</dt>
          <dd>{SITE_NAME}</dd>
          <dt className="text-muted-foreground">Tagline</dt>
          <dd>{SITE_TAGLINE}</dd>
          <dt className="text-muted-foreground">Description</dt>
          <dd>{SITE_DESCRIPTION}</dd>
          <dt className="text-muted-foreground">URL</dt>
          <dd>{SITE_URL}</dd>
        </dl>
      </FormSection>

      <FormSection title="Account" description="Change the password for this admin login.">
        <ChangePasswordForm />
      </FormSection>
    </div>
  );
}
