import type { Product } from "@/data/products";
import { AffiliateCta } from "./AffiliateCta";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="rounded-lg border border-gray-200 p-5">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="mt-1 text-sm text-gray-500">{product.pricing}</p>
      <p className="mt-3 text-sm">{product.targetUsers}</p>
      <ul className="mt-3 list-disc pl-4 text-sm text-gray-600">
        {product.mainFeatures.slice(0, 3).map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <div className="mt-4">
        <AffiliateCta product={product} />
      </div>
    </div>
  );
}
