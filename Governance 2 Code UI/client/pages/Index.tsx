import React, { useEffect, useMemo, useState, useCallback } from "react";
import AppLayout from "../components/layouts/AppLayout";
import MetricCard from "../components/tech/MetricCard";
import StatusConsole from "../components/tech/StatusConsole";
import Logo from "../components/tech/Logo";
import YAMLViewer from "../components/tech/YAMLViewer";
import MarkdownViewer from "../components/tech/MarkdownViewer";
import SuggestedQuestions from "../components/tech/SuggestedQuestions";
import ChatInput from "../components/tech/ChatInput";
import { makeGeneratedCode } from "../lib/generator";

type ChatMessage = {
  id: string;
  role: "user" | "system" | "assistant";
  text: string;
  timestamp: number;
  explanationText?: string;
  yamlCode?: string;
};

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ticks, setTicks] = useState(0);
  const [logs, setLogs] = useState<{ t: string; m: string }[]>([
    { t: time(), m: "GOVERNANCE ENGINE ONLINE" },
    { t: time(), m: "READY FOR POLICY GENERATION" },
  ]);
  const [showCodeArea, setShowCodeArea] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [explanationText, setExplanationText] = useState<string>("");
  const [yamlCode, setYamlCode] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"explanation" | "yaml">("explanation");

  // Controlled sidebar toggle to prevent unwanted changes
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Prevent keyboard shortcuts from interfering with sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent any sidebar-related keyboard shortcuts
      if (showCodeArea && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (showCodeArea) {
      document.addEventListener('keydown', handleKeyDown, true);
      return () => document.removeEventListener('keydown', handleKeyDown, true);
    }
  }, [showCodeArea]);
  
  // Load chat history from localStorage
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('governance-chat-history');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.warn('Failed to load chat history:', e);
    }
    return [
      {
        id: 'welcome',
        role: "system",
        text: "Ask a question or pick a suggestion to generate governance policy-as-code.",
        timestamp: Date.now()
      }
    ];
  });

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem('governance-chat-history', JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save chat history:', e);
    }
  }, [messages]);

  // synthetic metrics
  const sessions = 48 + (ticks % 7);
  const successRate = 97 + ((ticks >> 2) % 3);
  const queue = useMemo(() => (ticks % 2 === 0 ? "OPTIMAL" : "NORMAL"), [ticks]);

  useEffect(() => {
    const id = setInterval(() => setTicks((t) => t + 1), 1200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => {
      setProgress((p) => Math.min(100, p + Math.random() * 9 + 4));
      setLogs((L) => [
        ...L,
        {
          t: time(),
          m:
            Math.random() > 0.5
              ? "Analyzing compliance requirements..."
              : "Generating policy templates...",
        },
      ]);
    }, 700);
    return () => clearInterval(id);
  }, [loading]);

  const [generatedCode, setGeneratedCode] = useState<string>("");

  useEffect(() => {
    if (progress >= 100 && loading) {
      setLogs((L) => [...L, { t: time(), m: "GOVERNANCE POLICY GENERATION COMPLETED" }]);
      // create generated code snapshot
      const snapshot = makeGeneratedCode(sessions, successRate, queue);
      setGeneratedCode(snapshot);
      const t = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [progress, loading]);

  const runGeneration = async (input_value: string) => {
    setLoading(true);
    setProgress(0);
    setGeneratedCode("");
    setExplanationText("");
    setYamlCode("");
    setActiveTab("explanation");
    setShowCodeArea(true);
    setIsFullScreen(true);
    setLogs((L) => [
      ...L,
      { t: time(), m: "GOVERNANCE GENERATION STARTED" },
      { t: time(), m: "CONNECTING TO POLICY ENGINE..." },
    ]);

    try {
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input_value, session_id: "user_1" }),
      });

      const data = await resp.json();
      if (!resp.ok || !data?.ok) {
        const details = typeof data === "object" ? JSON.stringify(data) : String(data);
        setLogs((L) => [...L, { t: time(), m: `POLICY ENGINE ERROR: ${details}` }]);
        setLoading(false);
        return;
      }

      // Handle separated content - server provides formatted YAML
      const explanation = data.text || "No explanation provided";
      const yaml = data.yaml || "No YAML content generated";
      
      setExplanationText(explanation);
      setYamlCode(yaml);
      setGeneratedCode(yaml || explanation || "No content generated");
      setLogs((L) => [...L, { t: time(), m: "GOVERNANCE POLICY RECEIVED" }]);
      
      // Add assistant response to chat history
      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: "Generated governance policy with explanation and YAML code.",
        timestamp: Date.now(),
        explanationText: explanation,
        yamlCode: yaml
      }]);
      
      if (yaml && yaml !== "No YAML content generated") {
        setTimeout(() => setActiveTab("yaml"), 500);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setLogs((L) => [...L, { t: time(), m: `REQUEST FAILED: ${msg}` }]);
      setLoading(false);
      
      // Add error message to chat history
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: "system",
        text: `Error: ${msg}`,
        timestamp: Date.now()
      }]);
    }
  };

  const handleSendMessage = (text: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    runGeneration(text);
  };

  const handleSelectQuestion = (q: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: q,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    runGeneration(q);
  };

  const handleMinimize = () => {
    setIsFullScreen(false);
    setShowCodeArea(false);
  };

  const handleLogoClick = () => {
    setIsFullScreen(false);
    setShowCodeArea(false);
    setExplanationText("");
    setYamlCode("");
    setGeneratedCode("");
    setActiveTab("explanation");
  };

  const clearChatHistory = () => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: "system",
      text: "Ask a question or pick a suggestion to generate governance policy-as-code.",
      timestamp: Date.now()
    };
    setMessages([welcomeMessage]);
  };

  const loadHistoryItem = (message: ChatMessage) => {
    if (message.explanationText || message.yamlCode) {
      setExplanationText(message.explanationText || "");
      setYamlCode(message.yamlCode || "");
      setGeneratedCode(message.yamlCode || message.explanationText || "");
      setShowCodeArea(true);
      setIsFullScreen(true);
      setActiveTab(message.yamlCode ? "yaml" : "explanation");
    }
  };

  return (
    <AppLayout onLogoClick={handleLogoClick}>
      {/* Hero section - hide when full screen */}
      <div className={`transition-all duration-700 ease-in-out transform ${isFullScreen ? 'opacity-0 scale-95 h-0 overflow-hidden -translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>
        <section className="mx-auto max-w-6xl text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Logo size="lg" className="drop-shadow-[0_0_20px_rgba(0,229,255,0.35)]" onClick={handleLogoClick} />
            <div className="text-left">
              <p className="font-rajdhani text-xs uppercase tracking-[0.6em] text-cyan-300/70">Autonomous Governance Engine</p>
              <h2 className="font-orbitron text-3xl sm:text-5xl font-extrabold tracking-[0.15em] text-white drop-shadow-[0_0_20px_rgba(0,229,255,0.35)]">
                Governance to Code Generator
              </h2>
            </div>
          </div>
          
          <p className="mx-auto mt-4 max-w-2xl font-rajdhani text-base text-cyan-100/80">
            Transform compliance requirements into executable policy-as-code. Generate OPA Rego, Terraform, and governance frameworks automatically.
          </p>

          {/* Chat Interface */}
          <div className="mt-8 mx-auto max-w-4xl">
            {/* Suggested Questions */}
            <div className="mb-6">
              <div className="mb-4 font-rajdhani text-sm uppercase tracking-[0.25em] text-cyan-300/80">Ask a question or choose a suggestion</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={() => handleSelectQuestion("Generate a GCP data-at-rest and in-transit policy")}
                  className="text-left rounded-lg border border-cyan-400/20 bg-[#0b1f3d]/40 px-4 py-3 text-sm text-cyan-100 hover:bg-cyan-400/10 transition-colors"
                >
                  Generate a GCP data-at-rest and in-transit policy
                </button>
                <button
                  onClick={() => handleSelectQuestion("Create OPA Rego and Sentinel rules for S3 encryption")}
                  className="text-left rounded-lg border border-cyan-400/20 bg-[#0b1f3d]/40 px-4 py-3 text-sm text-cyan-100 hover:bg-cyan-400/10 transition-colors"
                >
                  Create OPA Rego and Sentinel rules for S3 encryption
                </button>
                <button
                  onClick={() => handleSelectQuestion("Enforce TLS 1.2+ on all ingress endpoints")}
                  className="text-left rounded-lg border border-cyan-400/20 bg-[#0b1f3d]/40 px-4 py-3 text-sm text-cyan-100 hover:bg-cyan-400/10 transition-colors"
                >
                  Enforce TLS 1.2+ on all ingress endpoints
                </button>
                <button
                  onClick={() => handleSelectQuestion("Require customer-managed keys (CMEK) on storage")}
                  className="text-left rounded-lg border border-cyan-400/20 bg-[#0b1f3d]/40 px-4 py-3 text-sm text-cyan-100 hover:bg-cyan-400/10 transition-colors"
                >
                  Require customer-managed keys (CMEK) on storage
                </button>
              </div>
            </div>

            {/* Chat Input */}
            <div className="rounded-lg border border-cyan-400/20 bg-[#1e1e1e] p-1">
              <div className="flex items-center gap-3">
                <textarea
                  placeholder="Ask a governance question... (e.g., 'Create a policy for data encryption in AWS')"
                  rows={3}
                  className="flex-1 resize-none bg-transparent p-4 text-cyan-100 placeholder:text-cyan-300/50 focus:outline-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      const text = (e.target as HTMLTextAreaElement).value.trim();
                      if (text) {
                        handleSendMessage(text);
                        (e.target as HTMLTextAreaElement).value = "";
                      }
                    }
                  }}
                  disabled={loading}
                />
                <button
                  onClick={(e) => {
                    const textarea = e.currentTarget.parentElement?.querySelector('textarea');
                    const text = textarea?.value.trim();
                    if (text) {
                      handleSendMessage(text);
                      if (textarea) textarea.value = "";
                    }
                  }}
                  disabled={loading}
                  className="mr-3 rounded-lg bg-cyan-500/80 px-6 py-3 font-rajdhani text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-50 transition-colors"
                >
                  {loading ? "Generating..." : "Generate Policy"}
                </button>
              </div>
            </div>
          </div>

          {/* metrics */}
          <div className="relative mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            <MetricCard title="Active Policies">
              <div className="flex items-end gap-2">
                <span>{sessions}</span>
                <span className="pb-1 text-sm font-rajdhani text-cyan-300/70">active</span>
              </div>
            </MetricCard>
            <MetricCard title="Compliance Rate">
              <div className="flex h-9 items-end gap-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span
                    key={i}
                    className="block w-2.5 flex-1 origin-bottom animate-bar bg-gradient-to-t from-cyan-500/30 to-cyan-300/80 shadow-[0_0_10px_rgba(0,229,255,0.5)]"
                    style={{ animationDelay: `${(i % 4) * 0.2}s`, height: `${(40 + (i % 5) * 10)}%` }}
                  />
                ))}
              </div>
            </MetricCard>
            <MetricCard title="Success Rate">
              <div className="flex items-baseline gap-2">
                <span>{successRate}%</span>
                <span className="pb-1 text-xs font-rajdhani uppercase tracking-widest text-emerald-300">stable</span>
              </div>
            </MetricCard>
            <MetricCard title="Engine Status">
              <div className="flex items-center gap-2">
                <span className={`inline-flex h-2.5 w-2.5 rounded-full ${queue === "OPTIMAL" ? "bg-emerald-400 shadow-[0_0_12px_2px_rgba(57,255,20,0.65)]" : "bg-yellow-400 shadow-[0_0_12px_2px_rgba(250,204,21,0.45)]"}`} />
                <span className="font-rajdhani text-xl text-cyan-100">{queue}</span>
              </div>
            </MetricCard>
          </div>
        </section>
      </div>

      {/* Full Screen Layout with Sidebar */}
      {showCodeArea && (
        <section className="fixed inset-0 z-50 bg-[#0a0f1c]" onClick={(e) => e.stopPropagation()}>
          {/* Top Header */}
          <div className="h-16 border-b border-cyan-400/20 bg-[#0a0f1c]/90 backdrop-blur-sm flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <Logo size="md" className="drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]" onClick={handleLogoClick} />
              <div>
                <h1 className="font-orbitron text-lg font-bold text-white">Governance to Code Generator</h1>
                <p className="font-rajdhani text-xs uppercase tracking-widest text-cyan-300/70">Policy Generation Engine</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                data-sidebar-toggle
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2d2d30] border border-cyan-400/20 text-cyan-200 font-rajdhani text-sm hover:bg-cyan-400/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {sidebarOpen ? 'Hide' : 'Show'} History
              </button>
              <button
                onClick={handleMinimize}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2d2d30] border border-cyan-400/20 text-cyan-200 font-rajdhani text-sm hover:bg-cyan-400/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
                Minimize
              </button>
            </div>
          </div>

          <div className="flex h-[calc(100vh-64px)]" onClick={(e) => e.stopPropagation()}>
            {/* Collapsible Sidebar - Chat History */}
            <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 ease-in-out bg-[#252526] border-r border-cyan-400/20 flex flex-col overflow-hidden`} onClick={(e) => e.stopPropagation()}>
              <div className="px-4 py-3 border-b border-cyan-400/20 bg-[#2d2d30] flex items-center justify-between">
                <h3 className="font-rajdhani text-sm uppercase tracking-[0.25em] text-cyan-200 flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
                  Chat History
                </h3>
                <button
                  onClick={clearChatHistory}
                  className="text-xs text-cyan-300/60 hover:text-cyan-300 transition-colors"
                >
                  Clear
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <div className="h-full p-3 flex flex-col">
                  {/* Suggested Questions */}
                  <SuggestedQuestions onSelect={handleSelectQuestion} />

                  {/* Messages */}
                  <div className="mt-2 flex-1 overflow-auto space-y-2 pr-1">
                    {messages.map((m) => (
                      <div 
                        key={m.id} 
                        className={`${
                          m.role === 'user' 
                            ? 'bg-[#0b1f3d]/60 border-cyan-400/30' 
                            : m.role === 'assistant'
                            ? 'bg-[#1a4c2e]/60 border-emerald-400/30 cursor-pointer hover:bg-[#1a4c2e]/80'
                            : 'bg-[#1a2433]/60 border-cyan-400/20'
                        } border rounded-md p-3 text-sm text-white transition-colors`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (m.role === 'assistant') loadHistoryItem(m);
                        }}
                      > 
                        <div className="mb-2 font-rajdhani text-xs uppercase tracking-widest text-cyan-300/80 flex items-center justify-between">
                          <span>{m.role === 'user' ? 'You' : m.role === 'assistant' ? 'Assistant' : 'System'}</span>
                          <span className="text-cyan-400/60">{new Date(m.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="whitespace-pre-wrap leading-6 text-cyan-50">{m.text}</div>
                        {m.role === 'assistant' && (m.explanationText || m.yamlCode) && (
                          <div className="mt-2 text-xs text-emerald-300/70">
                            Click to view generated policy
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-cyan-400/20">
                <ChatInput disabled={loading} onSend={handleSendMessage} />
              </div>
            </div>

            {/* Main Content - Full Width */}
            <div className="flex-1 flex flex-col bg-[#1e1e1e]" onClick={(e) => e.stopPropagation()}>
              {/* Tab Header */}
              <div className="flex border-b border-cyan-400/20 bg-[#2d2d30]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab("explanation");
                  }}
                  className={`px-6 py-3 border-r border-cyan-400/20 transition-colors ${
                    activeTab === "explanation" 
                      ? "bg-[#1e1e1e] border-b-2 border-b-orange-400" 
                      : "hover:bg-cyan-400/10"
                  }`}
                >
                  <h3 className="font-rajdhani text-sm uppercase tracking-[0.25em] text-cyan-200 flex items-center gap-2">
                    <span className={`inline-flex h-2 w-2 rounded-full ${activeTab === "explanation" ? "bg-orange-400" : "bg-orange-400/50"}`}></span>
                    Explanation
                  </h3>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab("yaml");
                  }}
                  className={`px-6 py-3 transition-colors ${
                    activeTab === "yaml" 
                      ? "bg-[#1e1e1e] border-b-2 border-b-cyan-400" 
                      : "hover:bg-cyan-400/10"
                  }`}
                >
                  <h3 className="font-rajdhani text-sm uppercase tracking-[0.25em] text-cyan-200 flex items-center gap-2">
                    <span className={`inline-flex h-2 w-2 rounded-full ${activeTab === "yaml" ? "bg-cyan-400" : "bg-cyan-400/50"}`}></span>
                    Generated YAML Policy
                  </h3>
                </button>
              </div>

              {/* Content Area - Full Width */}
              <div className="flex-1 overflow-hidden bg-[#1e1e1e]">
                {activeTab === "explanation" ? (
                  <MarkdownViewer content={explanationText} />
                ) : (
                  <YAMLViewer yaml={yamlCode} />
                )}
              </div>

              {/* Bottom Actions */}
              {(explanationText || yamlCode) && (
                <div className="border-t border-cyan-400/20 bg-[#2d2d30] p-4 flex justify-end gap-3">
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        const contentToCopy = activeTab === "explanation" ? explanationText : yamlCode;
                        await navigator.clipboard.writeText(contentToCopy);
                      } catch (e) {
                        console.warn("copy failed", e);
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-[#0b1f3d] border border-cyan-400/20 text-cyan-200 font-rajdhani text-sm hover:bg-cyan-400/10 transition-colors"
                  >
                    Copy {activeTab === "explanation" ? "Explanation" : "YAML"}
                  </button>
                  {activeTab === "yaml" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const blob = new Blob([yamlCode], { type: "text/plain;charset=utf-8" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `governance-policy-${Date.now()}.yaml`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="px-4 py-2 rounded-lg bg-[#0b1f3d] border border-cyan-400/20 text-cyan-200 font-rajdhani text-sm hover:bg-cyan-400/10 transition-colors"
                    >
                      Download YAML
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </AppLayout>
  );
}

function time() {
  const d = new Date();
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}
