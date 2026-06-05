import React, { useState, useEffect } from "react";
import { VideoAnalytics, YouTubeChannel, YouTubeVideo, HighlightItem, KeywordItem, TitleSuggestion, DescriptionSuggestion } from "./types";
import ChannelLinker from "./components/ChannelLinker";
import VideoSelector from "./components/VideoSelector";
import { 
  Youtube, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle, 
  Clock, 
  Smile, 
  Share2, 
  Copy, 
  Check, 
  Database, 
  ArrowUpRight, 
  Tag, 
  Maximize2, 
  Layers, 
  PenTool, 
  RefreshCw, 
  BookOpen, 
  Info,
  Sliders,
  History,
  FileSpreadsheet
} from "lucide-react";

// Default/Placeholder initial data to populate the dashboard magnificently on first mount
const INITIAL_DEMO_VIDEO_ANALYTICS: VideoAnalytics = {
  videoId: "Ke90Tje7VS0",
  videoTitle: "React 19 Deep Dive & New Hooks: Production Guide",
  channelTitle: "Frontend Academy",
  thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80",
  summary: "This deep dive guide explores the core production additions in React 19, focusing heavily on modern hooks like useActionState and useOptimistic. The material covers performance metrics, the elimination of manual dependency arrays via the new compiler, and the optimal handling of asynchronous client-server transitions.",
  highlights: [
    { timestamp: "00:45", title: "Overview of React Compiler", description: "Why traditional useMemo and useCallback are now completed automatically." },
    { timestamp: "03:15", title: "useActionState Hook Explained", description: "Managing pristine form pending states, database errors, and feedback states natively." },
    { timestamp: "08:22", title: "Integrating useOptimistic Hook", description: "Creating instantaneous client updates before the server async responses complete." },
    { timestamp: "12:50", title: "Server Actions Best Practices", description: "Securing backend endpoints directly called from client event handles." }
  ],
  sentiment: {
    score: 88,
    label: "Very Positive",
    breakdown: {
      positive: 88,
      neutral: 9,
      negative: 3
    },
    summary: "Audience sentiment is exceptionally high. Comments show robust interest in migrating to React 19, specifically praising the simplification of async form structures."
  },
  keywords: [
    { keyword: "react 19 tutorial", volume: 45000, competition: "Medium", score: 85 },
    { keyword: "useactionstate react", volume: 12000, competition: "Low", score: 92 },
    { keyword: "react compiler deep dive", volume: 28000, competition: "High", score: 70 },
    { keyword: "useoptimistic hook", volume: 9500, competition: "Low", score: 89 },
    { keyword: "frontend state architecture", volume: 15400, competition: "Medium", score: 78 }
  ],
  seoOptimized: {
    titleSuggestions: [
      { text: "React 19 Changed Forever: Solve Form Actions in Under 10 Minutes!", score: 94, reasoning: "High CTR promise using actionable timing cues and curiosity-inducing emotional brackets." },
      { text: "React 19 Masterclass: How to Use useActionState & useOptimistic", score: 89, reasoning: "Heavy keyword density targeting high search terms with authoritative phrasing." },
      { text: "Stop Using useMemo! The New React 19 Compiler Explained", score: 91, reasoning: "Bold negative hook creates immediate interest and disrupts current legacy dev routines." }
    ],
    tagsSuggestions: [
      "reactjs", "react 19", "useactionstate tutorial", "useoptimistic", "web development", "javascript ES2026", "react compiler", "frontend architecture"
    ],
    descriptionSuggestions: [
      {
        text: "Dive deep into React 19's revolutionary new features! In this practical production tutorial, we disassemble the upcoming React compiler and build real-world examples using useActionState and useOptimistic. \n\n🎯 WHAT YOU WILL MASTER:\n- How the React Compiler eliminates useMemo arrays.\n- Advanced asynchronous server transition handles.\n- Designing snappy UI states before server responses yield.\n\n🔗 LINKS & RESOURCES:\n- Get the code repositories: https://github.com/frontendacademy/react19\n- Join the server: https://discord.gg/frontendacademy\n\n#reactjs #webdev #javascript #react19",
        conversionGoal: "Actionable Click-Through Rate & Code Repo Downloads",
        elements: ["Timestamps checklist", "GitHub Download Links", "Social links", "Production tips"]
      }
    ]
  }
};

interface SyncLogEntry {
  timestamp: string;
  field: "Title" | "Description" | "Tags" | "All Meta";
  value: string;
  status: "Synced" | "Failed";
}

export default function App() {
  const [selectedUrl, setSelectedUrl] = useState("https://www.youtube.com/watch?v=Ke90Tje7VS0");
  const [isLoading, setIsLoading] = useState(false);
  const [isChannelLoading, setIsChannelLoading] = useState(false);
  const [analytics, setAnalytics] = useState<VideoAnalytics>(INITIAL_DEMO_VIDEO_ANALYTICS);
  const [linkedChannel, setLinkedChannel] = useState<YouTubeChannel | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live workspace editing states initialized with demo data
  const [activeTitle, setActiveTitle] = useState(INITIAL_DEMO_VIDEO_ANALYTICS.videoTitle);
  const [activeDescription, setActiveDescription] = useState(INITIAL_DEMO_VIDEO_ANALYTICS.seoOptimized.descriptionSuggestions[0].text);
  const [activeTags, setActiveTags] = useState<string[]>(INITIAL_DEMO_VIDEO_ANALYTICS.seoOptimized.tagsSuggestions);
  const [customKeyword, setCustomKeyword] = useState("");
  const [tagInputText, setTagInputText] = useState("");

  // Simulated live metadata sync status variables
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncHistory, setSyncHistory] = useState<SyncLogEntry[]>([
    { timestamp: "17:01:12", field: "Title", value: "Initial sync layout generated", status: "Synced" }
  ]);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  // Sync edited fields whenever analysis completes successfully
  useEffect(() => {
    setActiveTitle(analytics.videoTitle);
    setActiveDescription(analytics.seoOptimized.descriptionSuggestions[0]?.text || "");
    setActiveTags(analytics.seoOptimized.tagsSuggestions);
  }, [analytics]);

  const triggerCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [identifier]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [identifier]: false }));
    }, 1500);
  };

  // Perform full multi-modal analysis using node proxy to gemini
  const handleAnalyzeVideo = async (url: string, verbatimTranscript: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      // 1. Fetch metadata first
      const metadataRes = await fetch(`/api/youtube/video-info?url=${encodeURIComponent(url)}`);
      if (!metadataRes.ok) {
        throw new Error("Could not parse YouTube URL metadata overview. Make sure it is public.");
      }
      const videoMeta: YouTubeVideo = await metadataRes.json();

      // 2. Perform deep Gemini content/grounding audit
      const analyzeRes = await fetch("/api/youtube/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: videoMeta.id,
          videoTitle: videoMeta.title,
          channelTitle: videoMeta.channelTitle,
          thumbnailUrl: videoMeta.thumbnailUrl,
          customTranscript: verbatimTranscript
        }),
      });

      if (!analyzeRes.ok) {
        throw new Error("SEO Analytics generation failed via AI models. Please retry.");
      }

      const responseJSON = await analyzeRes.json();
      if (responseJSON.status === "success" && responseJSON.data) {
        setAnalytics(responseJSON.data);
      } else {
        throw new Error(responseJSON.error || "Analysis response parsed null properties.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during deep scanning");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyTitle = (titleText: string) => {
    setActiveTitle(titleText);
    const newEntry: SyncLogEntry = {
      timestamp: new Date().toTimeString().split(' ')[0],
      field: "Title",
      value: titleText,
      status: "Synced"
    };
    setSyncHistory(prev => [newEntry, ...prev]);
  };

  const handleApplyDescription = (descText: string) => {
    setActiveDescription(descText);
    const newEntry: SyncLogEntry = {
      timestamp: new Date().toTimeString().split(' ')[0],
      field: "Description",
      value: descText.substring(0, 45) + "...",
      status: "Synced"
    };
    setSyncHistory(prev => [newEntry, ...prev]);
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = tagInputText.trim().toLowerCase();
    if (tag && !activeTags.includes(tag)) {
      setActiveTags(prev => [...prev, tag]);
      setTagInputText("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setActiveTags(prev => prev.filter(t => t !== tagToRemove));
  };

  const handleAddNewKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const kw = customKeyword.trim();
    if (!kw) return;

    // Simulate metric lookup for custom tag keywords
    const score = Math.floor(Math.random() * 40) + 55;
    const volume = Math.floor(Math.random() * 32000) + 1200;
    const competition: 'Low' | 'Medium' | 'High' = volume > 20000 ? 'High' : (volume > 8000 ? 'Medium' : 'Low');
    
    const newKeywordItem: KeywordItem = {
      keyword: kw,
      volume,
      competition,
      score
    };

    setAnalytics(prev => ({
      ...prev,
      keywords: [newKeywordItem, ...prev.keywords]
    }));

    setCustomKeyword("");
  };

  // Perform Simulated API Metadata sync back to YouTube Video
  const handlePushToYouTube = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date().toTimeString().split(' ')[0];
      const newLogs: SyncLogEntry[] = [
        {
          timestamp: now,
          field: "All Meta",
          value: `YouTube API updated successfully. ID: ${analytics.videoId}`,
          status: "Synced"
        }
      ];
      setSyncHistory(prev => [...newLogs, ...prev]);
    }, 1800);
  };

  // Metric calculation: Optimization score based on metadata characteristics
  const calculateOptimizationScore = () => {
    let score = 30; // base weight
    if (activeTitle.length >= 40 && activeTitle.length <= 70) score += 25; // optimal length
    else if (activeTitle.length > 5 && activeTitle.length < 100) score += 15;

    if (activeDescription.length > 250) score += 20;
    else if (activeDescription.length > 50) score += 10;

    if (activeTags.length >= 5) score += 25;
    else score += (activeTags.length * 4);

    return Math.min(score, 100);
  };

  const optimizationScore = calculateOptimizationScore();

  return (
    <div className="app-container">
      {/* Header Bar matching Professional Polish specs */}
      <header className="header select-none">
        <div className="brand">
          <Youtube className="w-6 h-6 text-[#4F46E5] fill-current" />
          <span>TubeLens</span>
          <span className="font-normal text-[#94A3B8] text-sm font-mono">| SEO Optimizer & Audit Suite</span>
        </div>

        {/* Global Quick Search integrated in Header */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[#64748B] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            Gemini Engine:
          </span>
          <span className="text-[11px] font-mono text-slate-500 bg-[#F1F5F9] border border-slate-200 py-1 px-2.5 rounded-md font-semibold">
            gemini-3.5-flash-grounded
          </span>
        </div>

        {/* User Info / Badge */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-slate-800">Creator Account</span>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">Pro Account</span>
          </div>
          <div className="w-9 h-9 bg-gradient-to-tr from-[#4F46E5] to-rose-500 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-sm">
            YT
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-[#F8FAFC]">
        
        {/* ================= COLUMN 1 (3 Cols): METADATA CHANNELS & INGESTION ================= */}
        <div className="lg:col-span-3 space-y-4 flex flex-col">
          
          {/* Channel Linker component (Real parameters extraction) */}
          <ChannelLinker 
            onChannelLinked={(chan) => {
              setLinkedChannel(chan);
              // Auto-select latest video of that channel
              if (chan.videos && chan.videos.length > 0) {
                setSelectedUrl(chan.videos[0].url);
                handleAnalyzeVideo(chan.videos[0].url, "");
              }
            }} 
            onSelectVideoUrl={(url) => {
              setSelectedUrl(url);
              handleAnalyzeVideo(url, "");
            }}
            isLoading={isChannelLoading}
            setIsLoading={setIsChannelLoading}
          />

          {/* Individual Video Analyzer component */}
          <VideoSelector 
            selectedUrl={selectedUrl}
            setSelectedUrl={setSelectedUrl}
            onAnalyzeVideo={handleAnalyzeVideo}
            isLoading={isLoading}
          />

          {/* Active Video Overview Details Card */}
          <div className="card flex-1 bg-white">
            <div className="card-header flex items-center gap-2">
              <Info className="w-4 h-4 text-[#4F46E5]" />
              <span>Target Video Properties</span>
            </div>
            <div className="scroll-area flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="relative rounded-lg overflow-hidden group border border-[#E2E8F0] shadow-sm bg-black aspect-video flex items-center justify-center text-white">
                  <img 
                    src={analytics.thumbnailUrl || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&q=80"} 
                    alt={analytics.videoTitle} 
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                      <PlaySymbol />
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded uppercase">Active Scan</span>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2 mt-1.5 leading-snug">{analytics.videoTitle}</h4>
                  <p className="text-[11px] text-[#64748B] mt-0.5">Channel: {analytics.channelTitle}</p>
                </div>

                <div className="border-t border-[#E2E8F0] pt-3 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                    <p className="text-[10px] text-slate-400 font-medium">Video ID</p>
                    <p className="font-mono text-slate-700 font-semibold truncate mt-0.5">{analytics.videoId}</p>
                  </div>
                  <div className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                    <p className="text-[10px] text-slate-400 font-medium">Auto-Tags</p>
                    <p className="font-mono text-slate-700 font-semibold mt-0.5">{analytics.seoOptimized.tagsSuggestions.length} found</p>
                  </div>
                </div>
              </div>

              {/* Reset view fallback alerts */}
              {errorMsg && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-800 p-2.5 rounded-lg text-[11px] flex gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= COLUMN 2 (5 Cols): TRANSCRIPT SUMMARIZATION & SENTIMENT ================= */}
        <div className="lg:col-span-5 space-y-4 flex flex-col">
          
          {/* Automated Video Summary & Timeline Markers Card */}
          <div className="card flex-1 bg-white min-h-[300px]">
            <div className="card-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Transcript Summary & Key Highlights</span>
              </div>
              <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded">AI Extraction</span>
            </div>
            
            <div className="scroll-area bg-white space-y-4">
              <div className="bg-[#F5F3FF] border-l-4 border-[#4F46E5] p-3 rounded-r-lg">
                <p className="text-[11px] font-bold text-[#4F46E5] uppercase tracking-wider mb-1 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Core Video Summary Draft
                </p>
                <p className="text-xs text-[#475569] leading-relaxed italic">
                  "{analytics.summary}"
                </p>
                {analytics.wasAiGeneratedTranscript && (
                  <p className="text-[9px] text-[#64748B] mt-2.5 flex items-center gap-1">
                    <Info className="w-3 h-3 text-[#4F46E5]" /> Speculative summary drawn from search metadata & description signals.
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#4F46E5]" /> Highlights Timeline & Key Topic Markers
                </p>
                <div className="space-y-2">
                  {analytics.highlights.map((marker, i) => (
                    <div 
                      key={i} 
                      className="highlight-item flex items-start gap-3"
                      title="Click to simulate timeline jump"
                      onClick={() => {
                        const entry: SyncLogEntry = {
                          timestamp: new Date().toTimeString().split(' ')[0],
                          field: "All Meta",
                          value: `Simulated jump to timestamp ${marker.timestamp} inside player`,
                          status: "Synced"
                        };
                        setSyncHistory(prev => [entry, ...prev]);
                      }}
                    >
                      <span className="font-mono text-xs text-[#4F46E5] bg-white border border-[#4F46E5]/40 px-2 py-0.5 rounded font-bold shadow-sm">
                        {marker.timestamp}
                      </span>
                      <div className="overflow-hidden flex-1">
                        <p className="font-bold text-slate-800 text-xs">{marker.title}</p>
                        <p className="text-[11px] text-[#64748B] mt-0.5 leading-normal">{marker.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sentiment Analysis & Comments Audit Card */}
          <div className="card bg-white">
            <div className="card-header flex items-center gap-2">
              <Smile className="w-4 h-4 text-[#4F46E5]" />
              <span>Real-Time Sentiment Audit</span>
            </div>
            
            <div className="scroll-area bg-white space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800">Overall Sentiment Score</span>
                  <span className="badge badge-green">
                    {analytics.sentiment.score}% {analytics.sentiment.label}
                  </span>
                </div>
                
                {/* Horizontal Sentiment Bar */}
                <div className="sentiment-bar">
                  <div 
                    className="sentiment-fill" 
                    style={{ width: `${analytics.sentiment.score}%`, background: "#10B981" }} 
                  />
                </div>
                
                {/* Detailed breakdowns bars */}
                <div className="grid grid-cols-3 gap-2 mt-3.5 text-center text-[11px]">
                  <div className="bg-emerald-50 border border-emerald-100 p-1.5 rounded-lg">
                    <p className="text-emerald-800 font-semibold">{analytics.sentiment.breakdown.positive}%</p>
                    <p className="text-slate-400 text-[9px] font-medium uppercase mt-0.5">Positive</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-1.5 rounded-lg">
                    <p className="text-slate-600 font-semibold">{analytics.sentiment.breakdown.neutral}%</p>
                    <p className="text-slate-400 text-[9px] font-medium uppercase mt-0.5">Neutral</p>
                  </div>
                  <div className="bg-red-50 border border-red-100 p-1.5 rounded-lg">
                    <p className="text-red-800 font-semibold">{analytics.sentiment.breakdown.negative}%</p>
                    <p className="text-slate-400 text-[9px] font-medium uppercase mt-0.5">Negative</p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-[#64748B] leading-relaxed bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-lg">
                <span className="font-bold text-slate-700 block mb-0.5">Verbal & Comment Audit Summary</span>
                "{analytics.sentiment.summary}"
              </div>
            </div>
          </div>

          {/* Keyword Extraction & Volume Data Card */}
          <div className="card bg-white">
            <div className="card-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#4F46E5]" />
                <span>Extracted Search Keywords</span>
              </div>
              <span className="text-[10px] text-[#64748B] font-bold">Volume / Competition metrics</span>
            </div>

            <div className="scroll-area bg-white space-y-4">
              <div className="flex flex-wrap gap-1">
                {analytics.keywords.map((item, idx) => (
                  <span 
                    key={idx} 
                    className="keyword-tag inline-flex items-center gap-1.5 cursor-pointer hover:border-[#4F46E5] transition"
                    onClick={() => {
                      if (!activeTags.includes(item.keyword.toLowerCase())) {
                        setActiveTags(prev => [...prev, item.keyword.toLowerCase()]);
                      }
                    }}
                    title="Click to add instantly to video tags"
                  >
                    <span>{item.keyword}</span>
                    <span className="text-[9px] bg-slate-200 text-[#475569] font-mono px-1 rounded">
                      {item.volume >= 1000 ? `${(item.volume/1000).toFixed(0)}K` : item.volume}/mo
                    </span>
                    <span className={`text-[8px] font-bold px-1 rounded uppercase ${
                      item.competition === 'Low' ? 'text-emerald-700 bg-emerald-50' : 
                      item.competition === 'Medium' ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50'
                    }`}>
                      {item.competition}
                    </span>
                  </span>
                ))}
              </div>

              {/* Form to inject new simulated keyword into extraction lists */}
              <form onSubmit={handleAddNewKeyword} className="flex gap-2 border-t border-[#F1F5F9] pt-3">
                <input 
                  type="text" 
                  value={customKeyword}
                  onChange={(e) => setCustomKeyword(e.target.value)}
                  placeholder="Analyze custom keyword volume..."
                  className="w-full bg-white border border-[#CBD5E1] focus:border-[#4F46E5] text-xs px-3 py-1.5 rounded-lg outline-none"
                />
                <button 
                  type="submit" 
                  disabled={!customKeyword.trim()}
                  className="btn-primary py-1.5 px-3 text-xs flex items-center gap-1 whitespace-nowrap"
                >
                  <TrendingUp className="w-3.5 h-3.5" /> Analyze Term
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ================= COLUMN 3 (4 Cols): SEO RECOMMENDATIONS & WORKSPACE ================= */}
        <div className="lg:col-span-4 space-y-4 flex flex-col">
          
          {/* SEO AI Suggestion Options Block */}
          <div className="card bg-white flex-1 min-h-[300px]">
            <div className="card-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>SEO AI Recommendations</span>
              </div>
              <span className="font-mono text-xs font-bold text-slate-400">Score: {analytics.seoOptimized.titleSuggestions[0]?.score || "94"}/100</span>
            </div>

            <div className="scroll-area bg-white space-y-4">
              
              {/* Sugested Titles Options */}
              <div>
                <p className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-[#4F46E5]" /> High-CTR Recommended Titles (Click to Apply)
                </p>
                <div className="space-y-2">
                  {analytics.seoOptimized.titleSuggestions.map((title, idx) => (
                    <div 
                      key={idx} 
                      className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-lg hover:border-[#4F46E5] cursor-pointer transition flex flex-col justify-between"
                      onClick={() => handleApplyTitle(title.text)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800 flex-1 leading-snug">{title.text}</p>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 rounded flex-shrink-0 font-mono">
                          {title.score}% CTR
                        </span>
                      </div>
                      <p className="text-[9.5px] text-[#64748B] mt-1.5 leading-snug">
                        <strong className="text-indigo-600">Why it works:</strong> {title.reasoning}
                      </p>
                      <button 
                        type="button" 
                        className="text-[10px] text-[#4F46E5] hover:underline font-bold mt-2 self-end flex items-center gap-1"
                      >
                        Apply Title &rarr;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Descriptions draft */}
              <div className="border-t border-[#F1F5F9] pt-3.5">
                <p className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5 text-[#4F46E5]" /> Suggested Description Template
                </p>
                {analytics.seoOptimized.descriptionSuggestions.map((desc, i) => (
                  <div key={i} className="bg-[#FAF5FF] border border-[#E9D5FF] p-3 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
                        Goal: {desc.conversionGoal}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => triggerCopy(desc.text, `suggestedDesc-${i}`)}
                        className="text-[#64748B] hover:text-[#4F46E5] transition flex items-center gap-1 text-[10px]"
                      >
                        {copiedStates[`suggestedDesc-${i}`] ? (
                          <span className="text-emerald-700 flex items-center gap-0.5"><Check className="w-3 h-3" /> Copied</span>
                        ) : (
                          <><Copy className="w-3 h-3" /> Copy Draft</>
                        )}
                      </button>
                    </div>
                    <p className="text-[10.5px] text-[#1E293B] font-mono line-clamp-3 bg-white border border-[#F1F5F9] p-2 rounded whitespace-pre-wrap">
                      {desc.text}
                    </p>
                    <button
                      onClick={() => handleApplyDescription(desc.text)}
                      className="text-[10px] text-[#4F46E5] hover:underline font-bold block"
                    >
                      Apply to Workspace Description Workspace &rarr;
                    </button>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {desc.elements.map((el, k) => (
                        <span key={k} className="text-[8.5px] bg-[#EDE9FE] text-[#6B21A8] font-semibold px-1.5 rounded uppercase">
                          + {el}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Syncing YouTube metadata editor workspace (User interacts here) */}
          <div className="card bg-[#FAFBFD] border-[#CBD5E1]">
            <div className="card-header bg-[#F1F5F9] border-bottom-1 border-[#CBD5E1] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-[#4F46E5]" />
                <span className="text-[#1E293B] font-bold">YT Metadata Optimizer Workspace</span>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                optimizationScore >= 90 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800'
              }`}>
                Score: {optimizationScore}/100
              </span>
            </div>

            <div className="scroll-area space-y-3">
              <div>
                <label className="seo-input-label flex justify-between">
                  <span>Optimized Video Title</span>
                  <span className={`${activeTitle.length > 70 || activeTitle.length < 30 ? 'text-amber-600' : 'text-emerald-600'} text-[10px] font-mono`}>
                    {activeTitle.length}/100 chars
                  </span>
                </label>
                <input 
                  type="text" 
                  value={activeTitle}
                  onChange={(e) => setActiveTitle(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#CBD5E1] focus:border-[#4F46E5] text-xs font-medium text-slate-800 px-3 py-2 rounded-lg mt-1 outline-none"
                />
              </div>

              <div>
                <label className="seo-input-label flex justify-between">
                  <span>Optimized Video Description</span>
                  <span className="text-slate-400 text-[10px] font-mono">{activeDescription.length} chars</span>
                </label>
                <textarea 
                  value={activeDescription}
                  onChange={(e) => setActiveDescription(e.target.value)}
                  rows={4}
                  className="seo-textarea !mt-1 whitespace-pre-wrap leading-relaxed"
                />
              </div>

              <div>
                <label className="seo-input-label">Video Keywords & Metalink Tags</label>
                <div className="flex flex-wrap gap-1 bg-white border border-[#CBD5E1] p-2 rounded-lg mt-1 max-h-24 overflow-y-auto">
                  {activeTags.length === 0 ? (
                    <span className="text-slate-400 font-medium text-[10px] italic">No optimized tags added yet...</span>
                  ) : (
                    activeTags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 bg-[#F1F5F9] text-xs font-semibold px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                        <span>{tag}</span>
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="text-slate-400 hover:text-red-500 font-bold ml-1 text-[10px]">
                          x
                        </button>
                      </span>
                    ))
                  )}
                </div>
                
                {/* Form to insert custom meta tags */}
                <form onSubmit={handleAddCustomTag} className="flex gap-1.5 mt-1.5">
                  <input 
                    type="text" 
                    value={tagInputText}
                    onChange={(e) => setTagInputText(e.target.value)}
                    placeholder="Type new tag & press enter..."
                    className="w-full bg-white border border-[#CBD5E1] focus:border-[#4F46E5] text-[11px] px-2.5 py-1 rounded-md outline-none"
                  />
                  <button type="submit" className="text-xs bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] font-semibold text-slate-700 px-2 rounded-md">
                    + Add
                  </button>
                </form>
              </div>

              {/* Score Improvement feedback checklists */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 rounded-lg text-[10px] space-y-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">SEO Health Suggestions:</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircleStatus condition={activeTitle.length >= 40 && activeTitle.length <= 70} />
                  <span>Title length within optimum CTR range (40-70 characters)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircleStatus condition={activeDescription.length >= 250} />
                  <span>Comprehensive rich description density (over 250 characters)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircleStatus condition={activeTags.length >= 8} />
                  <span>Tag saturation (use at least 8 relevant keyword terms)</span>
                </div>
              </div>

              {/* Sync controls */}
              <div className="pt-2 border-t border-[#F1F5F9] flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handlePushToYouTube}
                  disabled={isSyncing}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Uploading Metadata to YouTube Server...
                    </>
                  ) : (
                    <>
                      <Layers className="w-3.5 h-3.5" />
                      Apply & Sync Optimizations to YouTube Video
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => {
                      const allText = `TITLE:\n${activeTitle}\n\nDESCRIPTION:\n${activeDescription}\n\nTAGS:\n${activeTags.join(', ')}`;
                      triggerCopy(allText, 'copyall');
                    }}
                    className="btn-secondary py-1 px-2.5 text-[11px] flex items-center justify-center gap-1"
                  >
                    {copiedStates['copyall'] ? (
                      <><Check className="w-3.5 h-3.5 text-green-600" /> Copied!</>
                    ) : (
                      <><Copy className="w-3.5 h-3.5" /> Copy Meta Block</>
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setActiveTitle(analytics.videoTitle);
                      setActiveDescription(analytics.seoOptimized.descriptionSuggestions[0]?.text || "");
                      setActiveTags(analytics.seoOptimized.tagsSuggestions);
                      const now = new Date().toTimeString().split(' ')[0];
                      setSyncHistory(prev => [{ timestamp: now, field: "All Meta", value: "Reset workspace to suggestions", status: "Synced" }, ...prev]);
                    }}
                    className="btn-secondary py-1 px-2.5 text-[11px] hover:text-red-700 flex items-center justify-center gap-1"
                  >
                    Reset Changes
                  </button>
                </div>
              </div>

              {/* Real-time synchronization live logs */}
              {syncHistory.length > 0 && (
                <div className="border-t border-[#F1F5F9] pt-3">
                  <div className="flex items-center gap-1 mb-1.5">
                    <History className="w-3 h-3 text-[#64748B]" />
                    <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Sync Log / Action History</span>
                  </div>
                  <div className="bg-[#1E293B] text-[#38BDF8] p-2 rounded-lg font-mono text-[9px] max-h-24 overflow-y-auto space-y-1">
                    {syncHistory.map((item, id) => (
                      <div key={id} className="flex items-start justify-between gap-1.5 border-b border-slate-800/80 pb-1 last:border-0">
                        <span className="text-slate-400 font-semibold">{item.timestamp}</span>
                        <span className="flex-1 text-[#F1F5F9] truncate">
                          [{item.field}] {item.value}
                        </span>
                        <span className="text-emerald-400 font-bold uppercase shrink-0">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

// Inline pure-svg elements to prevent external network image loads failure
function PlaySymbol() {
  return (
    <svg className="w-4 h-4 text-white fill-current translate-x-0.5" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckCircleStatus({ condition }: { condition: boolean }) {
  if (condition) {
    return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />;
  }
  return <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex-shrink-0" />;
}
