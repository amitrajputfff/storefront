"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { routes } from "@/constants/routes";

export function SearchBar({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(routes.search(query));
  }

  return (
    <form onSubmit={handleSubmit} className="relative max-w-md">
      <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="pl-9"
      />
    </form>
  );
}
