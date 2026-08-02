import { getContent } from "@/lib/content/get-content";
import { FlashSaleForm } from "./flash-sale-form";

export default async function FlashSalePage() {
  const content = await getContent("home.flash_sale");
  return <FlashSaleForm initialValue={content} />;
}
