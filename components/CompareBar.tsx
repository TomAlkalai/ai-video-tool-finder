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
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-gray-200 bg-white px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        {selectedSlugs.length === 1 ? (
          <p className="text-sm text-gray-600">Select one more tool to compare.</p>
        ) : (
          <p className="text-sm text-gray-600">{selectedSlugs.length} tools selected.</p>
        )}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-gray-500 hover:underline"
          >
            Clear
          </button>
          {selectedSlugs.length >= 2 && (
            <Link
              href={`/compare?tools=${selectedSlugs.join(",")}`}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Compare {selectedSlugs.length} tools
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
