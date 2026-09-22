import { DisclosureNote } from "./DisclosureNote";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <DisclosureNote />
        <p className="mt-2 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} AI Video Tool Finder
        </p>
      </div>
    </footer>
  );
}
