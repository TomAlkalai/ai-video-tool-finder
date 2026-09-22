import Link from "next/link";

const links = [
  { href: "/#guides", label: "Guides" },
  { href: "/affiliate-disclosure", label: "Disclosure" },
];

export function Nav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-base font-semibold text-slate-900">
          AI Video Tool Finder
        </Link>
        <ul className="flex items-center gap-6 text-sm text-slate-600">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-slate-900">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/find-my-tool"
              className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:border-slate-400 hover:text-slate-900"
            >
              Ask our AI
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
