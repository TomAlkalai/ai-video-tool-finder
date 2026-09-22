import { describe, it, expect } from "vitest";
import { pickRecommendation } from "./quiz";

describe("pickRecommendation", () => {
  it("maps the youtube goal to the YouTube recommendation page", () => {
    const result = pickRecommendation({ goal: "youtube", needsFreePlan: false });
    expect(result.pageSlug).toBe("best-ai-video-generator-for-youtube");
  });

  it("maps the avatar goal to the avatar recommendation page", () => {
    const result = pickRecommendation({ goal: "avatar", needsFreePlan: false });
    expect(result.pageSlug).toBe("best-ai-avatar-generator");
  });

  it("picks a free-plan product first when needsFreePlan is true", () => {
    // best-ai-avatar-generator's products are heygen (freePlan: true) then synthesia (freePlan: false)
    const result = pickRecommendation({ goal: "avatar", needsFreePlan: true });
    expect(result.topProductSlug).toBe("heygen");
  });

  it("uses the first listed product when needsFreePlan is false", () => {
    const result = pickRecommendation({ goal: "editing", needsFreePlan: false });
    expect(result.topProductSlug).toBe("descript");
  });
});
