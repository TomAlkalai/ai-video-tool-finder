import Link from "next/link";

const links = [
  { href: "/#guides", label: "Guides" },
  { href: "/affiliate-disclosure", label: "Disclosure" },
];

export function Nav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="shrink-0 whitespace-nowrap text-sm font-semibold text-slate-900 sm:text-base">
          AI Video Tool Finder
        </Link>
        <ul className="flex items-center gap-3 text-sm text-slate-600 sm:gap-6">
          {links.map((link) => (
            <li key={link.href} className="hidden sm:block">
              <Link href={link.href} className="hover:text-slate-900">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/find-my-tool"
              className="inline-flex min-h-[40px] items-center whitespace-nowrap rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:border-slate-400 hover:text-slate-900"
            >
              Ask our AI
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
