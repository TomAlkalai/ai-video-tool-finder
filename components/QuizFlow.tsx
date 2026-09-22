"use client";

import { useState } from "react";
import Link from "next/link";
import { quizQuestions } from "@/data/quiz-questions";
import { pickRecommendation, type QuizAnswers } from "@/lib/quiz";
import { getProductBySlug } from "@/lib/products";
import { recommendationPages } from "@/data/recommendation-pages";
import { AffiliateCta } from "./AffiliateCta";

export function QuizFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});

  const question = quizQuestions[step];

  function answer(value: string) {
    const next = { ...answers, [question.id]: question.id === "needsFreePlan" ? value === "true" : value };
    setAnswers(next);
    if (step < quizQuestions.length - 1) {
      setStep(step + 1);
    }
  }

  const isComplete = answers.goal !== undefined && answers.needsFreePlan !== undefined;

  if (isComplete) {
    const result = pickRecommendation(answers as QuizAnswers);
    const product = getProductBySlug(result.topProductSlug)!;
    const page = recommendationPages.find((p) => p.slug === result.pageSlug)!;

    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Our pick for you</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">{product.name}</h2>
        <p className="mt-2 text-slate-600">{product.targetUsers}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <AffiliateCta product={product} />
          <Link href={`/${page.slug}`} className="text-sm font-medium text-blue-600 hover:underline">
            See the full comparison &rarr;
          </Link>
        </div>
        <button
          type="button"
          onClick={() => {
            setAnswers({});
            setStep(0);
          }}
          className="mt-4 min-h-[40px] px-1 text-sm text-slate-400 hover:text-slate-600"
        >
          Start over
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Question {step + 1} of {quizQuestions.length}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-slate-900">{question.prompt}</h2>
      <div className="mt-5 flex flex-col gap-2">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => answer(opt.value)}
            className="min-h-[44px] rounded-lg border border-slate-200 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
