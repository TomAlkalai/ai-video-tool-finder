export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 10.5l3.5 3.5L16 6" />
    </svg>
  );
}

export function DashIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 10h10" />
    </svg>
  );
}

export function WarningIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 3.5l7.5 13H2.5l7.5-13z" />
      <path d="M10 8.5v3.25" />
      <circle cx="10" cy="14.25" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}
