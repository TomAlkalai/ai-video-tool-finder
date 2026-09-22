export type RecommendationPageConfig = {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  criteria: string[];
  productSlugs: string[];
  verdict: { productSlug: string; text: string }[];
};

export const recommendationPages: RecommendationPageConfig[] = [
  {
    slug: "best-ai-video-generator-for-youtube",
    title: "Best AI Video Generator for YouTube",
    metaDescription: "Compare AI video tools for making full-length YouTube videos, by pricing, features, and workflow.",
    intro: "For full-length YouTube videos, the tool needs to handle a full script-to-video pipeline, not just short clips: AI voice, editing, and export quality all matter more than for short-form content.",
    criteria: ["Script-to-video workflow", "AI voice quality", "Editing depth", "Export resolution and limits", "Pricing at YouTube-length video volumes"],
    productSlugs: ["invideo", "veed", "descript"],
    verdict: [
      { productSlug: "invideo", text: "Best overall for going from a script or outline to a rough-cut long-form video quickly." },
      { productSlug: "descript", text: "Best if the video is mostly talking-head footage you already recorded and want to edit fast." },
      { productSlug: "veed", text: "Good middle ground if captions and quick browser-based editing matter most." },
    ],
  },
  {
    slug: "best-ai-video-generator-for-faceless-youtube",
    title: "Best AI Video Generator for Faceless YouTube Channels",
    metaDescription: "Compare AI video tools for faceless YouTube channels: script-to-video, stock footage, and AI voiceover.",
    intro: "Faceless channels lean entirely on script-to-video generation, stock/AI footage, and AI voiceover, since there's no on-camera presenter to film or edit around.",
    criteria: ["Script-to-video generation quality", "AI voiceover options", "Stock footage/library breadth", "Repurposing existing long-form content"],
    productSlugs: ["invideo", "pictory", "runway"],
    verdict: [
      { productSlug: "invideo", text: "Best for a full script-to-video pipeline built specifically for this workflow." },
      { productSlug: "pictory", text: "Best if you're repurposing existing blog posts or long-form video into faceless shorts." },
      { productSlug: "runway", text: "Best for generative b-roll when stock footage feels too generic, used alongside another editor." },
    ],
  },
  {
    slug: "best-ai-video-tool-for-tiktok",
    title: "Best AI Video Tool for TikTok",
    metaDescription: "Compare AI video tools for TikTok and Shorts: fast turnaround, captions, and vertical export.",
    intro: "TikTok rewards speed and captions over polish: the best tools here get from idea to a captioned vertical clip in minutes.",
    criteria: ["Turnaround speed", "Auto-caption quality", "Vertical/9:16 export", "Trend-friendly templates"],
    productSlugs: ["veed", "invideo"],
    verdict: [
      { productSlug: "veed", text: "Best for fast, caption-first vertical clips edited directly in the browser." },
      { productSlug: "invideo", text: "Best if you want templated short-form videos generated from a script or prompt." },
    ],
  },
  {
    slug: "best-ai-avatar-generator",
    title: "Best AI Avatar Generator",
    metaDescription: "Compare AI avatar video tools for presenter-style videos without filming a person.",
    intro: "AI avatar tools stand in for a human presenter. The main trade-offs are avatar realism, language coverage, and how much a custom avatar costs.",
    criteria: ["Avatar realism", "Number of languages/voices", "Custom avatar creation", "Pricing per minute of output"],
    productSlugs: ["heygen", "synthesia"],
    verdict: [
      { productSlug: "heygen", text: "Best avatar realism and value for creators, with a usable free tier to test first." },
      { productSlug: "synthesia", text: "Best for corporate training/onboarding video at scale, with no free plan." },
    ],
  },
  {
    slug: "best-ai-video-tool-for-product-ads",
    title: "Best AI Video Tool for Product Ads",
    metaDescription: "Compare AI video tools for short promotional and product ad videos.",
    intro: "Product ads are short, need to hit a clear call to action, and often need multiple variants fast for testing.",
    criteria: ["Speed to first draft", "Template variety for ads", "Ability to produce multiple variants", "Export quality for paid placements"],
    productSlugs: ["invideo", "runway", "heygen"],
    verdict: [
      { productSlug: "invideo", text: "Best for producing several ad variants quickly from templates." },
      { productSlug: "runway", text: "Best for a distinctive generative-AI look that stands out from templated ads." },
      { productSlug: "heygen", text: "Best when the ad needs a presenter talking directly to camera without filming one." },
    ],
  },
  {
    slug: "best-ai-video-editor",
    title: "Best AI Video Editor",
    metaDescription: "Compare AI-powered video editors for editing existing footage: captions, transcript editing, and cleanup.",
    intro: "This is for editing footage you already have, not generating video from scratch: captioning, cutting, and cleanup speed matter most.",
    criteria: ["Editing paradigm (timeline vs transcript)", "Auto-caption quality", "Filler-word/cleanup tools", "Export quality and limits on the free plan"],
    productSlugs: ["descript", "veed"],
    verdict: [
      { productSlug: "descript", text: "Best if you'd rather edit by editing a transcript, especially for talking-head or podcast footage." },
      { productSlug: "veed", text: "Best for fast timeline-based editing in the browser with strong auto-captions." },
    ],
  },
];
