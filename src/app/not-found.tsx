import Link from "next/link";
import { SearchBar } from "@/components/collection/search-bar";
import { categories } from "@/mock/categories";
import { routes } from "@/constants/routes";

export default function NotFound() {
  const popular = categories.slice(0, 3);

  return (
    <main className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <p className="text-6xl font-medium tracking-tight">404</p>
      <h1 className="mt-4 text-xl font-medium">This page took a wrong turn.</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>

      <div className="mt-8 w-full">
        <SearchBar initialQuery="" />
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {popular.map((c) => (
          <Link
            key={c.handle}
            href={routes.collection(c.handle)}
            className="rounded-full border px-4 py-2 text-sm hover:bg-muted"
          >
            {c.name}
          </Link>
        ))}
      </div>

      <Link href={routes.home()} className="mt-8 text-sm font-medium underline underline-offset-4">
        Back to Home
      </Link>
    </main>
  );
}
