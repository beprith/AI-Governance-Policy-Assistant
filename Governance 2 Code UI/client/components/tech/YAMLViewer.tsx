import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  yaml: string;
  className?: string;
};

export default function YAMLViewer({ yaml, className = "" }: Props) {
  // Custom VS Code dark theme for YAML with better visibility
  const customStyle = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      background: '#1e1e1e',
      color: '#d4d4d4', // Brighter base text
      fontSize: '13px',
      lineHeight: '1.6',
      fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", Consolas, "Courier New", monospace',
      margin: 0,
      padding: '1rem',
      overflow: 'auto',
    },
    'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      background: '#1e1e1e',
      color: '#d4d4d4',
      fontSize: '13px',
      lineHeight: '1.6',
      fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", Consolas, "Courier New", monospace',
    },
    // YAML-specific token styling with improved visibility
    '.token.key': {
      color: '#9cdcfe', // Bright blue for keys
      fontWeight: '500',
    },
    '.token.atrule': {
      color: '#9cdcfe',
      fontWeight: '500',
    },
    '.token.string': {
      color: '#ce9178', // Warm orange for strings
    },
    '.token.number': {
      color: '#b5cea8', // Light green for numbers
    },
    '.token.boolean': {
      color: '#569cd6', // Blue for booleans
      fontWeight: '500',
    },
    '.token.null': {
      color: '#569cd6',
      fontWeight: '500',
    },
    '.token.comment': {
      color: '#6a9955', // Green for comments
      fontStyle: 'italic',
    },
    '.token.punctuation': {
      color: '#d4d4d4', // White for punctuation
    },
    '.token.anchor': {
      color: '#dcdcaa', // Yellow for anchors
    },
    '.token.tag': {
      color: '#569cd6', // Blue for tags
      fontWeight: '500',
    },
    '.token.scalar': {
      color: '#ce9178',
    },
    // Enhanced list markers
    '.token.list': {
      color: '#d4d4d4',
      fontWeight: '600',
    },
    // Indentation guides (if supported)
    '.token.indent': {
      color: '#404040',
    }
  };

  const customProps = {
    style: customStyle,
    language: "yaml",
    showLineNumbers: true,
    lineNumberStyle: {
      minWidth: '3em',
      paddingRight: '1em',
      color: '#858585',
      backgroundColor: 'transparent',
      fontSize: '12px',
      userSelect: 'none' as const,
      borderRight: '1px solid #404040',
      marginRight: '1em',
    },
    wrapLines: true,
    wrapLongLines: true,
    startingLineNumber: 1,
  };

  if (!yaml || yaml.trim() === "" || yaml === "No YAML content generated") {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center text-cyan-300/50">
          <div className="animate-pulse">
            <div className="font-orbitron text-lg mb-2 text-white">Generating YAML...</div>
            <div className="font-rajdhani text-sm text-cyan-300">Compiling policy-as-code</div>
          </div>
        </div>
      </div>
    );
  }

  const cleanYaml = yaml.trim();

  return (
    <div className={`h-full overflow-auto ${className} bg-[#1e1e1e]`}>
      <div className="p-0">
        <SyntaxHighlighter {...customProps}>
          {cleanYaml}
        </SyntaxHighlighter>
      </div>
    </div>
  );
} 