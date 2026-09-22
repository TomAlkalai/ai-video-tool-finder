import Link from "next/link";

export function DisclosureNote() {
  return (
    <p className="text-sm text-slate-500">
      We may earn a commission if you sign up through a link on this page, at
      no extra cost to you. See our{" "}
      <Link href="/affiliate-disclosure" className="font-medium text-blue-600 hover:underline">
        affiliate disclosure
      </Link>
      .
    </p>
  );
}
