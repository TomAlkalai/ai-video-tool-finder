import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";
import { resolveOutboundUrl } from "@/lib/redirect";
import { track } from "@vercel/analytics/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return NextResponse.redirect(new URL("/ai-video-tools", request.url), { status: 302 });
  }

  const referer = request.headers.get("referer") ?? "";

  await track("outbound_click", { slug: product.slug, from: referer });

  return NextResponse.redirect(resolveOutboundUrl(product), { status: 302 });
}
