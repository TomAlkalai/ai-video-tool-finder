import { DisclosureNote } from "./DisclosureNote";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <DisclosureNote />
        <p className="mt-3 text-sm text-slate-400">
          &copy; {new Date().getFullYear()} AI Video Tool Finder
        </p>
      </div>
    </footer>
  );
}
