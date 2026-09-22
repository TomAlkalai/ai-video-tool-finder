import { logoBySlug } from "@/data/logos";

export function ToolLogo({
  slug,
  name,
  size = 32,
}: {
  slug: string;
  name: string;
  size?: number;
}) {
  const src = logoBySlug[slug];
  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      className="shrink-0 rounded-md border border-slate-200 bg-white object-contain p-0.5"
      style={{ width: size, height: size }}
      title={name}
    />
  );
}
