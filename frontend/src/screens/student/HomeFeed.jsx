import { useEffect, useMemo, useState } from "react";
import { Bell, ImagePlus, ThumbsUp, MessageCircle, Share2, Home, Users, Calendar, User, Sparkles } from "lucide-react";
import { T, Pill, BottomNav, LoadingState, ErrorNotice, EmptyState } from "../../lib/ui";
import { PostsApi, ApiError } from "../../lib/api";

function timeAgo(iso) {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function PostCard({ p, openPost }) {
  return (
    <div onClick={() => openPost(p)} className="bg-white border rounded-3xl p-5 flex flex-col gap-2 cursor-pointer" style={{ borderColor: "rgba(199,196,215,0.2)", boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
      <div className="flex items-start justify-between">
        <div className="flex gap-3 items-center">
          <div className="rounded-full flex items-center justify-center w-10 h-10 shrink-0" style={{ background: p.anonymous ? "#6063ee" : T.primaryTint2 }}>
            {p.anonymous ? <User size={16} color="white" /> : <Sparkles size={16} color={T.primary} />}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex gap-2 items-center flex-wrap">
              <span className="font-['Hanken_Grotesk'] font-semibold text-[16px]" style={{ color: T.ink }}>{p.userName}</span>
              <span className="font-['Inter'] text-[12px]" style={{ color: T.faint }}>• {timeAgo(p.createdAt)}</span>
            </div>
            <span className="font-['Inter'] font-bold text-[10.5px] px-2 py-0.5 rounded-full tracking-wide w-fit" style={{ background: T.primaryTint2, color: T.primary }}>{p.community || "General"}</span>
          </div>
        </div>
      </div>
      <div className="font-['Hanken_Grotesk'] font-semibold text-[17px] leading-snug" style={{ color: T.ink }}>{p.title}</div>
      <div className="font-['Inter'] text-[14px] leading-relaxed line-clamp-4" style={{ color: T.muted }}>{p.content}</div>
      {p.mediaUrl && <img src={p.mediaUrl} alt="" className="h-[140px] w-full object-cover rounded-xl" />}
      <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(199,196,215,0.2)" }}>
        <div className="flex items-center gap-1 rounded-full px-1 py-1" style={{ background: "#dce9ff" }}>
          <span className="p-1.5"><ThumbsUp size={13} color={T.ink} /></span>
          <span className="font-['Hanken_Grotesk'] font-semibold text-[13px] w-5 text-center" style={{ color: T.ink }}>{p.likeCount}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[13px] font-['Inter']" style={{ color: T.muted }}>
          <MessageCircle size={15} /> Comments
        </div>
        <Share2 size={14} color={T.faint} />
      </div>
    </div>
  );
}

export default function HomeFeed({ go, openPost }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    PostsApi.list()
      .then((data) => { if (!cancelled) setPosts(data); })
      .catch((err) => { if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load the feed."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.community).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [posts]);

  const visiblePosts = activeCategory === "All" ? posts : posts.filter((p) => p.community === activeCategory);

  return (
    <div className="flex flex-col gap-8 items-center pb-32 relative">
      <div className="w-full sticky top-0 z-10" style={{ background: T.page, boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-white" style={{ background: T.primary }}>C</div>
            <span className="font-['Hanken_Grotesk'] font-extrabold text-[24px]" style={{ color: T.primary }}>Clubverse</span>
          </div>
          <button onClick={() => go("notifications")} className="bg-transparent border-none cursor-pointer relative"><Bell size={20} color={T.ink} /></button>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-[358px]">
        <div onClick={() => go("create")} className="bg-white border rounded-3xl p-5 flex gap-4 items-start cursor-pointer" style={{ borderColor: "rgba(199,196,215,0.2)", boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
          <div className="w-10 h-10 rounded-full shrink-0" style={{ background: T.sky }} />
          <div className="flex-1 flex flex-col gap-3">
            <div className="rounded-xl px-4 py-3 font-['Inter'] text-[15px]" style={{ background: T.primaryTint, color: T.muted }}>What's on your mind?</div>
            <div className="flex items-center justify-between">
              <ImagePlus size={17} color={T.faint} />
              <span className="rounded-full px-4 py-1.5 text-white font-['Inter'] font-bold text-[11px] tracking-wide" style={{ background: T.primary }}>Post</span>
            </div>
          </div>
        </div>

        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto w-full">
            {categories.map((c) => <Pill key={c} active={c === activeCategory} onClick={() => setActiveCategory(c)}>{c}</Pill>)}
          </div>
        )}

        {error && <ErrorNotice text={error} />}
        {loading && <LoadingState label="Loading posts…" />}
        {!loading && !error && visiblePosts.length === 0 && <EmptyState text="No posts yet. Be the first to post!" />}
        {!loading && visiblePosts.map(p => <PostCard key={p.id} p={p} openPost={openPost} />)}
      </div>

      <button onClick={() => go("create")} className="absolute right-4 bottom-24 rounded-2xl w-14 h-14 flex items-center justify-center cursor-pointer border-none" style={{ background: T.primary, boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.15)" }}>
        <span className="text-white text-2xl leading-none">+</span>
      </button>

      <div className="fixed bottom-0 w-[390px]">
        <BottomNav
          active="home" go={go}
          items={[
            { key: "home", icon: Home, label: "Home" },
            { key: "communities", icon: Users, label: "Communities" },
            { key: "events", icon: Calendar, label: "Events" },
            { key: "notifications", icon: MessageCircle, label: "Messages" },
            { key: "profile", icon: User, label: "Profile" },
          ]}
        />
      </div>
    </div>
  );
}
