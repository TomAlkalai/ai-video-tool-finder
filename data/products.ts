export type Product = {
  name: string;
  slug: string;
  category: string[];
  pricing: string;
  freePlan: boolean;
  mainFeatures: string[];
  targetUsers: string;
  pros: string[];
  cons: string[];
  affiliateUrl: string;
  officialUrl: string;
  affiliateStatus: "pending" | "active" | "rejected";
  lastVerified: string;
};

export const products: Product[] = [
  {
    name: "VEED",
    slug: "veed",
    category: ["editing", "youtube", "tiktok", "captions"],
    pricing: "Free plan; paid plans from ~$12/mo billed annually",
    freePlan: true,
    mainFeatures: [
      "Browser-based video editor",
      "Auto subtitles/captions",
      "AI avatars and text-to-speech",
      "Brand kit and templates",
    ],
    targetUsers: "Creators and marketers who want a fast browser-based editor with captions built in",
    pros: ["No install, runs in browser", "Strong auto-caption quality", "Generous free tier for short clips"],
    cons: ["Exports are watermarked/limited on free plan", "Can feel slow on longer timelines"],
    affiliateUrl: "https://www.veed.io",
    officialUrl: "https://www.veed.io",
    affiliateStatus: "pending",
    lastVerified: "2026-09-22",
  },
  {
    name: "InVideo",
    slug: "invideo",
    category: ["youtube", "faceless", "ads"],
    pricing: "Free plan; paid plans from ~$20/mo billed annually",
    freePlan: true,
    mainFeatures: [
      "Text-to-video AI generation",
      "Large template library",
      "AI voiceover",
      "Script-to-video workflow",
    ],
    targetUsers: "YouTubers and marketers who want to go from script or prompt to a rough-cut video fast",
    pros: ["Fast script-to-video pipeline", "Large stock/template library", "Good for faceless YouTube content"],
    cons: ["AI-generated footage quality is inconsistent", "Free plan is watermarked"],
    affiliateUrl: "https://invideo.io",
    officialUrl: "https://invideo.io",
    affiliateStatus: "pending",
    lastVerified: "2026-09-22",
  },
  {
    name: "Pictory",
    slug: "pictory",
    category: ["youtube", "faceless", "repurposing"],
    pricing: "No permanent free plan; paid plans from ~$19/mo billed annually",
    freePlan: false,
    mainFeatures: [
      "Turns long-form content/blog posts into short videos",
      "Auto-highlight clipping from long videos",
      "Text-to-video from script",
      "Auto captions",
    ],
    targetUsers: "Creators repurposing blog posts or long videos into short-form clips",
    pros: ["Strong repurposing workflow (blog -> video, long -> short)", "Good caption styling options"],
    cons: ["No free plan, only a trial", "Less suited to fully original creative video"],
    affiliateUrl: "https://pictory.ai",
    officialUrl: "https://pictory.ai",
    affiliateStatus: "pending",
    lastVerified: "2026-09-22",
  },
  {
    name: "Descript",
    slug: "descript",
    category: ["editing", "podcast", "captions"],
    pricing: "Free plan; paid plans from ~$12/mo billed annually",
    freePlan: true,
    mainFeatures: [
      "Edit video/audio by editing a text transcript",
      "AI overdub / voice cloning",
      "Filler-word removal",
      "Screen recording",
    ],
    targetUsers: "Podcasters and creators who prefer editing by editing text rather than a timeline",
    pros: ["Transcript-based editing is very fast for talking-head content", "Excellent filler-word removal"],
    cons: ["Less suited to heavy motion-graphics style editing", "Free plan caps transcription minutes"],
    affiliateUrl: "https://www.descript.com",
    officialUrl: "https://www.descript.com",
    affiliateStatus: "pending",
    lastVerified: "2026-09-22",
  },
  {
    name: "HeyGen",
    slug: "heygen",
    category: ["avatar", "ads", "localization"],
    pricing: "Free plan (limited credits); paid plans from ~$24/mo billed annually",
    freePlan: true,
    mainFeatures: [
      "Realistic AI avatars",
      "Text-to-video with avatar presenters",
      "Multi-language voice translation/dubbing",
      "Custom avatar creation",
    ],
    targetUsers: "Teams that want a presenter-style video without filming a person",
    pros: ["Best-in-class avatar realism", "Strong multi-language dubbing"],
    cons: ["Paid tiers needed for custom avatars and longer videos", "Avatar movement can still read as synthetic"],
    affiliateUrl: "https://www.heygen.com",
    officialUrl: "https://www.heygen.com",
    affiliateStatus: "pending",
    lastVerified: "2026-09-22",
  },
  {
    name: "Synthesia",
    slug: "synthesia",
    category: ["avatar", "training", "localization"],
    pricing: "No permanent free plan; paid plans from ~$29/mo billed annually",
    freePlan: false,
    mainFeatures: [
      "AI avatar video generation",
      "120+ language voiceovers",
      "Custom avatar creation (studio plans)",
      "Screen recording + templates for training videos",
    ],
    targetUsers: "Corporate teams making training, onboarding, or internal comms videos",
    pros: ["Polished, enterprise-friendly output", "Wide language coverage for localization"],
    cons: ["No free plan", "Overkill/pricey for casual creators"],
    affiliateUrl: "https://www.synthesia.io",
    officialUrl: "https://www.synthesia.io",
    affiliateStatus: "pending",
    lastVerified: "2026-09-22",
  },
  {
    name: "Runway",
    slug: "runway",
    category: ["editing", "generative", "ads"],
    pricing: "Free plan (limited credits); paid plans from ~$12/mo billed annually",
    freePlan: true,
    mainFeatures: [
      "Text-to-video and image-to-video generative AI",
      "AI video editing tools (green screen, inpainting)",
      "Motion brush and camera controls",
      "Fast generative iteration for short clips",
    ],
    targetUsers: "Creators and editors who want generative AI b-roll or effects, not full narrated videos",
    pros: ["Leading generative video quality for short clips", "Powerful AI editing magic tools"],
    cons: ["Not built for long-form or talking-head video", "Credits burn fast on paid generation"],
    affiliateUrl: "https://runwayml.com",
    officialUrl: "https://runwayml.com",
    affiliateStatus: "pending",
    lastVerified: "2026-09-22",
  },
];
