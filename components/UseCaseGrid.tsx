import Link from "next/link";

type UseCaseItem = { href: string; label: string; description: string };

export function UseCaseGrid({ items }: { items: UseCaseItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-300"
        >
          <h3 className="font-semibold text-slate-900">{item.label}</h3>
          <p className="mt-1 text-sm text-slate-500">{item.description}</p>
        </Link>
      ))}
    </div>
  );
}
