import React, { useState, useEffect } from "react";
import { Youtube, Search, Sparkles, FileText, Check, AlertTriangle, Play } from "lucide-react";

interface VideoSelectorProps {
  selectedUrl: string;
  setSelectedUrl: (url: string) => void;
  onAnalyzeVideo: (url: string, customTranscript: string) => void;
  isLoading: boolean;
}

const SAMPLE_VIDEOS = [
  {
    title: "React 19 Deep Dive & New Hooks",
    url: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
    description: "Learn about React compiler, useActionState, useOptimistic, and Server Actions."
  },
  {
    title: "Is Next.js 15 Actually Good?",
    url: "https://www.youtube.com/watch?v=Ke7J0KqS67c",
    description: "Comprehensive performance review of the latest server component layouts."
  }
];

export default function VideoSelector({ selectedUrl, setSelectedUrl, onAnalyzeVideo, isLoading }: VideoSelectorProps) {
  const [customTranscript, setCustomTranscript] = useState("");
  const [showTranscriptInput, setShowTranscriptInput] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-clear error when user modifies URL
  useEffect(() => {
    setError(null);
  }, [selectedUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUrl.trim()) {
      setError("Please specify a YouTube video URL first");
      return;
    }
    
    // Check if the link looks like YouTube
    const ytRegex = /(youtube\.com|youtu\.be|youtube-nocookie\.com|shorts)/i;
    if (!ytRegex.test(selectedUrl)) {
      setError("Please supply a valid YouTube link (e.g. youtube.com/watch?v=...)");
      return;
    }
    
    setError(null);
    onAnalyzeVideo(selectedUrl, customTranscript);
  };

  return (
    <div className="card">
      <div className="card-header flex items-center gap-2">
        <Search className="w-4 h-4 text-[#4F46E5]" />
        <span>Analyze YouTube Video URL</span>
      </div>

      <div className="scroll-area bg-white space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <p className="text-xs text-[#64748B] leading-relaxed">
            Audit any YouTube clip, Shorts, or standard link to generate automated summaries, sentiment evaluations, and recommended optimizations.
          </p>

          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                value={selectedUrl}
                onChange={(e) => setSelectedUrl(e.target.value)}
                placeholder="Paste YouTube Video URL (or click preset below)..."
                className="w-full bg-[#FFFFFF] border border-[#CBD5E1] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-[#1E293B] px-3 py-2.5 pl-9 rounded-lg text-xs placeholder-slate-400 outline-none transition-all"
                disabled={isLoading}
              />
              <Youtube className="absolute left-3 top-3 w-4 h-4 text-[#64748B]" />
            </div>

            <button
              type="submit"
              disabled={isLoading || !selectedUrl.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing Content Models...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Get AI Video Analytics
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="text-red-700 bg-red-50 border border-red-200 text-[11px] p-2.5 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Advanced option: Custom Transcript Paste */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-2.5">
            <button
              type="button"
              onClick={() => setShowTranscriptInput(!showTranscriptInput)}
              className="flex items-center justify-between w-full text-left font-semibold text-[#475569] hover:text-[#1E293B] transition-colors text-[11px]"
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#4F46E5]" />
                <span>Advanced: Provide Video Transcript</span>
              </span>
              <span className="text-[10px] text-[#64748B]">
                {customTranscript ? (
                  <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-emerald-100 font-normal">
                    <Check className="w-2.5 h-2.5" /> Parsed
                  </span>
                ) : (
                  showTranscriptInput ? "Hide" : "Show"
                )}
              </span>
            </button>

            {showTranscriptInput && (
              <div className="mt-2.5 space-y-2">
                <textarea
                  value={customTranscript}
                  onChange={(e) => setCustomTranscript(e.target.value)}
                  placeholder="Paste verbatim captions / transcripts. This delivers perfectly precise timestamp analysis! Otherwise, we build transcripts conceptually using grounding queries."
                  className="w-full bg-[#FFFFFF] border border-[#E2E8F0] focus:border-[#4F46E5] text-[#1E293B] p-2 rounded text-xs font-mono h-24 placeholder-slate-400 outline-none resize-none"
                />
                {customTranscript && (
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#64748B] font-mono">{customTranscript.length} characters loaded</span>
                    <button 
                      type="button" 
                      onClick={() => setCustomTranscript("")}
                      className="text-red-600 hover:underline font-semibold"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </form>

        {/* Preset Samples */}
        <div className="pt-2 border-t border-[#F1F5F9]">
          <p className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider mb-2">Preset Video Templates:</p>
          <div className="space-y-1.5">
            {SAMPLE_VIDEOS.map((vid, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSelectedUrl(vid.url);
                  onAnalyzeVideo(vid.url, "");
                }}
                className="w-full flex items-start bg-[#F8FAFC] hover:bg-[#F1F5F9] p-2 rounded-lg border border-[#E2E8F0] transition-colors text-left group"
                disabled={isLoading}
              >
                <div className="p-1 bg-[#F5F3FF] group-hover:bg-[#EDE9FE] text-[#4F46E5] rounded mr-2 mt-0.5 transition-colors">
                  <Play className="w-3.5 h-3.5 fill-[#4F46E5]" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-[#1E293B] group-hover:text-[#4F46E5] transition-colors truncate">{vid.title}</p>
                  <p className="text-[10px] text-[#64748B] truncate mt-0.5 leading-none">{vid.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
