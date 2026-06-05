import React, { useState } from "react";
import { YouTubeChannel } from "../types";
import { Youtube, Search, ArrowRight, Eye, Users, Video, AlertCircle, Sparkles, RefreshCw } from "lucide-react";

interface ChannelLinkerProps {
  onChannelLinked: (channel: YouTubeChannel) => void;
  onSelectVideoUrl: (url: string) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

const QUICKSTART_CHANNELS = [
  { name: "Fireship", query: "@fireship", logoLetter: "F", theme: "from-amber-500 to-red-600" },
  { name: "Web Dev Simplified", query: "@WebDevSimplified", logoLetter: "W", theme: "from-blue-500 to-indigo-600" },
  { name: "Veritasium", query: "@veritasium", logoLetter: "V", theme: "from-emerald-500 to-teal-600" },
  { name: "MrBeast", query: "@mrbeast", logoLetter: "M", theme: "from-pink-500 to-purple-600" },
];

export default function ChannelLinker({ onChannelLinked, onSelectVideoUrl, isLoading, setIsLoading }: ChannelLinkerProps) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentChannel, setCurrentChannel] = useState<YouTubeChannel | null>(null);

  const handleLinkChannel = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/youtube/link-channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelQuery: searchQuery }),
      });

      if (!res.ok) {
        throw new Error("Could not retrieve channel details. Check network or try again.");
      }

      const responseData = await res.json();
      if (responseData.status === "success" && responseData.data) {
        onChannelLinked(responseData.data);
        setCurrentChannel(responseData.data);
      } else {
        throw new Error(responseData.error || "Channel lookup failed.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to link channel");
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1) + "M";
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  return (
    <div className="card min-h-[180px]">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Youtube className="w-5 h-5 text-rose-600" />
          <span>YouTube Channel Integration</span>
        </div>
        {currentChannel && (
          <button 
            type="button"
            onClick={() => {
              setCurrentChannel(null);
              setQuery("");
            }}
            className="text-xs text-rose-600 hover:text-rose-700 underline font-semibold transition"
          >
            Reset
          </button>
        )}
      </div>

      <div className="scroll-area flex flex-col justify-between h-full bg-white">
        {!currentChannel ? (
          <div className="space-y-4">
            <p className="text-xs text-[#64748B] leading-relaxed">
              Connect a public channel to automatically fetch recent uploads, audience statistics, and perform Bulk SEO actions.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLinkChannel(query);
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter Handle (e.g. @fireship) or channel name..."
                  className="w-full bg-[#FFFFFF] border border-[#CBD5E1] focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] text-[#1E293B] px-3 py-2 pl-9 rounded-lg text-xs placeholder-slate-400 outline-none transition-all"
                  disabled={isLoading}
                />
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#64748B]" />
              </div>
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="btn-primary flex items-center gap-1.5 py-2 px-4 text-xs select-none"
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    Connect
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </form>

            {/* Quickstart Presets */}
            <div className="pt-2 border-t border-[#F1F5F9]">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-[#64748B] mb-2">
                Sample Live Creators (Quick Load):
              </p>
              <div className="grid grid-cols-2 gap-2">
                {QUICKSTART_CHANNELS.map((ch) => (
                  <button
                    key={ch.query}
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      setQuery(ch.query);
                      handleLinkChannel(ch.query);
                    }}
                    className="flex items-center gap-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] p-2 rounded-lg text-left transition text-xs group"
                  >
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${ch.theme} text-white font-bold flex items-center justify-center text-[10px] shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      {ch.logoLetter}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-[#1E293B] truncate group-hover:text-[#4F46E5] transition-colors">{ch.name}</p>
                      <p className="text-[9px] text-[#64748B] truncate">{ch.query}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Channel Card UI when successfully connected */
          <div className="space-y-4">
            <div className="flex gap-3">
              <img
                src={currentChannel.thumbnailUrl || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=100&q=80"}
                alt={currentChannel.title}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full border border-[#E2E8F0] object-cover shadow-sm bg-[#F1F5F9]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=100&q=80";
                }}
              />
              <div className="overflow-hidden flex-1">
                <h3 className="font-bold text-[#1E293B] text-sm flex items-center gap-1.5 truncate">
                  {currentChannel.title}
                  <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" title="Linked" />
                </h3>
                <p className="text-[11px] text-[#4F46E5] font-mono truncate">{currentChannel.customUrl || `@${currentChannel.title.toLowerCase().replace(/\s+/g,'')}`}</p>
                <p className="text-[10px] text-[#64748B] line-clamp-1 mt-0.5">{currentChannel.description}</p>
              </div>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-3 gap-2 text-center bg-[#F8FAFC] border border-[#E2E8F0] p-2 rounded-lg">
              <div>
                <p className="text-[9px] text-[#64748B] flex items-center justify-center gap-1"><Users className="w-3 h-3 text-indigo-500" /> Subscribers</p>
                <p className="font-semibold text-slate-900 text-xs mt-0.5">{formatNumber(currentChannel.subscriberCount)}</p>
              </div>
              <div>
                <p className="text-[9px] text-[#64748B] flex items-center justify-center gap-1"><Video className="w-3 h-3 text-rose-500" /> Uploads</p>
                <p className="font-semibold text-slate-900 text-xs mt-0.5">{currentChannel.videoCount}</p>
              </div>
              <div>
                <p className="text-[9px] text-[#64748B] flex items-center justify-center gap-1"><Eye className="w-3 h-3 text-amber-500" /> Total Views</p>
                <p className="font-semibold text-slate-900 text-xs mt-0.5">{formatNumber(currentChannel.viewCount)}</p>
              </div>
            </div>

            {currentChannel.videos && currentChannel.videos.length > 0 && (
              <div className="pt-2 border-t border-[#E2E8F0]">
                <p className="text-[11px] font-bold text-[#64748B] mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Recent Uploads (Click to Analyze):
                </p>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {currentChannel.videos.map((vid) => (
                    <button
                      key={vid.id}
                      type="button"
                      onClick={() => onSelectVideoUrl(vid.url)}
                      className="w-full flex text-left items-center bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-md p-1.5 transition overflow-hidden group"
                    >
                      <img
                        src={vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.id}/mqdefault.jpg`}
                        alt={vid.title}
                        referrerPolicy="no-referrer"
                        className="w-14 h-9 object-cover rounded flex-shrink-0 bg-[#E2E8F0] border border-[#CBD5E1]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${vid.id}/mqdefault.jpg`;
                        }}
                      />
                      <div className="ml-2 overflow-hidden flex-1">
                        <h4 className="text-[11px] font-semibold text-[#1E293B] line-clamp-1 leading-tight group-hover:text-[#4F46E5] transition-colors">
                          {vid.title}
                        </h4>
                        <p className="text-[9px] text-[#64748B] font-mono truncate mt-0.5">ID: {vid.id}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 p-2.5 rounded-lg text-red-700 text-[11px] flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-red-600" />
            <div>
              <span className="font-semibold">Sync Info:</span> {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
