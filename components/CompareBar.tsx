import Link from "next/link";

export function CompareBar({
  selectedSlugs,
  onClear,
}: {
  selectedSlugs: string[];
  onClear: () => void;
}) {
  if (selectedSlugs.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_16px_-4px_rgba(15,23,42,0.12)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        {selectedSlugs.length === 1 ? (
          <p className="text-sm text-slate-600">Select one more tool to compare.</p>
        ) : (
          <p className="text-sm font-medium text-slate-700">{selectedSlugs.length} tools selected.</p>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="inline-flex min-h-[40px] items-center px-2 text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            Clear
          </button>
          {selectedSlugs.length >= 2 && (
            <Link
              href={`/compare?tools=${selectedSlugs.join(",")}`}
              className="inline-flex min-h-[44px] items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              Compare {selectedSlugs.length} tools
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
