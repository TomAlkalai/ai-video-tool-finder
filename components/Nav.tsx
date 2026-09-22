import Link from "next/link";

const links = [
  { href: "/ai-video-tools", label: "All tools" },
  { href: "/affiliate-disclosure", label: "Disclosure" },
];

export function Nav() {
  return (
    <header className="border-b border-gray-200">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold">
          AI Video Tool Finder
        </Link>
        <ul className="flex gap-6 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
