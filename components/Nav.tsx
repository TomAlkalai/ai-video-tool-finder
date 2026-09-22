import Link from "next/link";

const links = [
  { href: "/#guides", label: "Guides" },
  { href: "/affiliate-disclosure", label: "Disclosure" },
];

export function Nav() {
  return (
    <header className="border-b border-gray-200">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold">
          AI Video Tool Finder
        </Link>
        <ul className="flex items-center gap-6 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/find-my-tool"
              className="rounded-md border border-gray-300 px-3 py-1.5 hover:border-indigo-400"
            >
              Ask our AI
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
