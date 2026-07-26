import { Metadata } from "next";
import { TrackOrderForm } from "@/components/content/track-order-form";
import { SectionHeading } from "@/components/shared/section-heading";
import { SITE_NAME } from "@/constants/site";

export const metadata: Metadata = {
  title: `Track Your Order | ${SITE_NAME}`,
  description: "Track the status of your ZEEVARA order.",
};

export default function TrackOrderPage() {
  return (
    <main className="mx-auto max-w-lg px-6 py-16 md:py-24">
      <SectionHeading
        title="Track Your Order"
        description="Enter your order number and the email you used at checkout."
        className="mb-10"
      />
      <TrackOrderForm />
    </main>
  );
}
