export type QuizOption = { value: string; label: string };
export type QuizQuestion = { id: "goal" | "needsFreePlan"; prompt: string; options: QuizOption[] };

export const quizQuestions: QuizQuestion[] = [
  {
    id: "goal",
    prompt: "What are you trying to make?",
    options: [
      { value: "youtube", label: "A full-length YouTube video" },
      { value: "faceless", label: "A faceless YouTube video (no on-camera presenter)" },
      { value: "tiktok", label: "A TikTok or Shorts clip" },
      { value: "avatar", label: "A video with an AI presenter/avatar" },
      { value: "ads", label: "A short product ad" },
      { value: "editing", label: "I have footage already and just need to edit it" },
    ],
  },
  {
    id: "needsFreePlan",
    prompt: "Do you need a free plan to start?",
    options: [
      { value: "true", label: "Yes, I want to try it free first" },
      { value: "false", label: "No, budget isn't the main constraint" },
    ],
  },
];
