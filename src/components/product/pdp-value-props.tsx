import { getContent } from "@/lib/content/get-content";
import { AdminIcon } from "@/lib/content/icon-map";

export async function PdpValueProps() {
  const { items } = await getContent("home.value_props");
  const featured = items.slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="border-t pt-10 md:pt-14">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {featured.map((value) => (
          <div key={value.title} className="flex flex-col items-start gap-2">
            <AdminIcon name={value.icon} className="text-muted-foreground size-5" />
            <p className="text-sm font-semibold">{value.title}</p>
            <p className="text-muted-foreground text-xs">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
