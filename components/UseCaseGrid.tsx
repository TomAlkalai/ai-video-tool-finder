import Link from "next/link";

type UseCaseItem = { href: string; label: string; description: string };

export function UseCaseGrid({ items }: { items: UseCaseItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-lg border border-gray-200 p-5 hover:border-indigo-400"
        >
          <h3 className="font-semibold">{item.label}</h3>
          <p className="mt-1 text-sm text-gray-500">{item.description}</p>
        </Link>
      ))}
    </div>
  );
}
