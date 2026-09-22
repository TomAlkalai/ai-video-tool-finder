import type { Metadata } from "next";
import { QuizFlow } from "@/components/QuizFlow";

export const metadata: Metadata = {
  title: "Find Your AI Video Tool | AI Video Tool Finder",
  description: "Answer two quick questions to get a starting recommendation.",
};

export default function FindMyToolPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Not sure what to make?
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        Answer two quick questions and we&apos;ll point you at a starting pick. This
        is a simple decision tree over the same comparisons on this site, not a
        model analyzing your answers.
      </p>
      <div className="mt-8">
        <QuizFlow />
      </div>
    </main>
  );
}
