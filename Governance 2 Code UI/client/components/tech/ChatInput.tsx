import React, { useState } from "react";

type Props = {
  disabled?: boolean;
  onSend: (text: string) => void;
};

export default function ChatInput({ disabled, onSend }: Props) {
  const [text, setText] = useState("");

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText("");
  };

  return (
    <div className="border-t border-cyan-400/20 bg-[#2d2d30] p-2">
      <div className="flex items-center gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={2}
          placeholder="Ask a governance question..."
          className="flex-1 resize-none rounded-md border border-cyan-400/20 bg-[#1e1e1e] p-2 text-sm text-cyan-100 placeholder:text-cyan-300/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
          disabled={disabled}
        />
        <button
          onClick={submit}
          disabled={disabled}
          className="rounded-md bg-cyan-500/80 px-3 py-2 text-sm text-white hover:bg-cyan-500 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
} 