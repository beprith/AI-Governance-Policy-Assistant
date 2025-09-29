import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type Props = {
  content: string;
  className?: string;
};

export default function MarkdownViewer({ content, className = "" }: Props) {
  if (!content || content.trim() === "" || content === "No explanation provided") {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center text-cyan-300/50">
          <div className="animate-pulse">
            <div className="font-orbitron text-xl mb-3 text-white">Generating Explanation...</div>
            <div className="font-rajdhani text-base text-cyan-300">Processing compliance analysis</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full overflow-auto p-8 ${className}`}>
      <div className="prose prose-invert prose-cyan max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            // Custom styling for markdown elements
            h1: ({ children }) => (
              <h1 className="text-2xl font-orbitron font-bold text-white mb-6 border-b border-cyan-400/20 pb-3">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-orbitron font-semibold text-cyan-100 mb-4 mt-8">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-rajdhani font-medium text-cyan-200 mb-3 mt-6">
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className="text-base font-rajdhani font-medium text-cyan-200 mb-2 mt-4">
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p className="text-cyan-50 leading-7 mb-4 font-mono text-sm">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside text-cyan-50 mb-4 space-y-2">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside text-cyan-50 mb-4 space-y-2">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="text-cyan-50 leading-6 font-mono text-sm">
                {children}
              </li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-cyan-400 pl-4 italic text-cyan-200 mb-4 bg-cyan-900/10 py-2">
                {children}
              </blockquote>
            ),
            code: ({ inline, children }) => (
              inline ? (
                <code className="bg-[#2d2d30] text-cyan-300 px-2 py-1 rounded text-sm font-mono">
                  {children}
                </code>
              ) : (
                <code className="block bg-[#2d2d30] text-cyan-100 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap">
                  {children}
                </code>
              )
            ),
            pre: ({ children }) => (
              <pre className="bg-[#2d2d30] text-cyan-100 p-4 rounded-lg mb-4 overflow-x-auto">
                {children}
              </pre>
            ),
            table: ({ children }) => (
              <table className="w-full border-collapse border border-cyan-400/20 mb-4">
                {children}
              </table>
            ),
            th: ({ children }) => (
              <th className="border border-cyan-400/20 bg-cyan-900/20 px-4 py-2 text-left text-cyan-200 font-rajdhani">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-cyan-400/20 px-4 py-2 text-cyan-50 font-mono text-sm">
                {children}
              </td>
            ),
            strong: ({ children }) => (
              <strong className="text-cyan-100 font-semibold">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="text-cyan-200 italic">
                {children}
              </em>
            ),
            a: ({ href, children }) => (
              <a 
                href={href} 
                className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            hr: () => (
              <hr className="border-cyan-400/20 my-6" />
            )
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
} 