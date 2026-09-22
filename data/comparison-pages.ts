export type ComparisonPageConfig = {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  productSlugA: string;
  productSlugB: string;
  verdict: string;
};

export const comparisonPages: ComparisonPageConfig[] = [
  {
    slug: "invideo-vs-pictory",
    title: "InVideo vs Pictory",
    metaDescription: "InVideo vs Pictory compared on pricing, features, AI capabilities, and best use cases.",
    intro: "Both InVideo and Pictory target script-to-video and repurposing workflows, but they optimize for different starting points.",
    productSlugA: "invideo",
    productSlugB: "pictory",
    verdict: "Pick InVideo if you're starting from a script or prompt and want a broad template library. Pick Pictory if you're starting from existing long-form content (a blog post or a long video) that you want to turn into shorter videos.",
  },
  {
    slug: "veed-vs-descript",
    title: "VEED vs Descript",
    metaDescription: "VEED vs Descript compared on pricing, features, editing style, and best use cases.",
    intro: "VEED and Descript are both editors with strong caption/transcript tooling, but they differ in editing paradigm: timeline-based versus transcript-based.",
    productSlugA: "veed",
    productSlugB: "descript",
    verdict: "Pick VEED for fast, browser-based timeline editing with strong auto-captions. Pick Descript if you'd rather edit by editing a text transcript, especially for podcast or talking-head content.",
  },
];
