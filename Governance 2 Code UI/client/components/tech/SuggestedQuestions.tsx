import React from "react";

type Props = {
  onSelect: (q: string) => void;
};

const QUESTIONS = [
  "Generate a GCP data-at-rest and in-transit policy",
  "Create OPA Rego and Sentinel rules for S3 encryption",
  "Enforce TLS 1.2+ on all ingress endpoints",
  "Require customer-managed keys (CMEK) on storage",
  "Block public access for model endpoints",
];

export default function SuggestedQuestions({ onSelect }: Props) {
  return (
    <div className="p-3">
      <div className="mb-2 font-rajdhani text-[11px] uppercase tracking-[0.25em] text-cyan-300/80">Suggested questions</div>
      <div className="flex flex-col gap-2">
        {QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="text-left rounded-md border border-cyan-400/20 bg-[#0b1f3d]/40 px-3 py-2 text-[12px] text-cyan-100 hover:bg-cyan-400/10 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
} 