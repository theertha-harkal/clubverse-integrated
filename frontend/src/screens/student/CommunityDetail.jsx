import { useEffect, useState } from "react";
import { Check, Users2, Globe, ThumbsUp, MessageCircle } from "lucide-react";
import { T, TopBar, Tag, LoadingState, ErrorNotice, EmptyState } from "../../lib/ui";
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

export default function CommunityDetail({ go, community, openPost }) {
  const c = community || { title: "General" };
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    PostsApi.list()
      .then((all) => { if (!cancelled) setPosts(all.filter((p) => (p.community || "General") === c.title)); })
      .catch((err) => { if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load posts."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [c.title]);

  return (
    <div className="flex flex-col pb-10">
      <TopBar title="Clubverse" onBack={() => go("communities")} />
      <div className="h-[110px]" style={{ background: T.sky }} />
      <div className="px-4 -mt-10">
        <div className="bg-white rounded-3xl p-5 flex flex-col gap-3" style={{ border: "1px solid rgba(199,196,215,0.3)", boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
          <div className="flex items-end justify-between">
            <div className="w-20 h-20 rounded-3xl border-4 border-white flex items-center justify-center text-white font-['Hanken_Grotesk'] font-bold text-[28px]" style={{ background: "#6063ee", boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" }}>{c.title?.[0]?.toUpperCase()}</div>
            <button className="border rounded-full px-4 py-2 flex items-center gap-2 text-[12px] font-['Inter'] font-bold" style={{ borderColor: T.primary, color: T.primary }}><Check size={12} /> Joined</button>
          </div>
          <div>
            <div className="font-['Hanken_Grotesk'] font-bold text-[24px]" style={{ color: T.ink }}>{c.title}</div>
            <div className="flex gap-4 mt-2 font-['Inter'] text-[13px]" style={{ color: T.muted }}>
              <span className="flex items-center gap-1"><Users2 size={13} /> {c.postCount ?? posts.length} post{(c.postCount ?? posts.length) === 1 ? "" : "s"}</span>
              <span className="flex items-center gap-1"><Globe size={13} /> Public Community</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 px-4 mt-6 sticky top-0 z-10 py-3" style={{ background: "rgba(248,249,255,0.9)", borderBottom: "1px solid rgba(199,196,215,0.3)" }}>
        <span className="font-['Inter'] font-bold text-[12px] tracking-wide pb-2" style={{ color: T.primary, borderBottom: `2px solid ${T.primary}` }}>Posts</span>
      </div>

      <div className="flex flex-col gap-3 px-4 mt-3">
        {error && <ErrorNotice text={error} />}
        {loading && <LoadingState label="Loading posts…" />}
        {!loading && !error && posts.length === 0 && <EmptyState text="No posts in this community yet." />}
        {posts.map((p) => (
          <div key={p.id} onClick={() => openPost && openPost(p)} className="relative bg-white rounded-3xl p-5 flex flex-col gap-2 cursor-pointer" style={{ border: "1px solid rgba(199,196,215,0.2)", boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" }}>
            <div className="flex items-start justify-between">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-['Inter'] font-bold text-[11px]" style={{ background: "#6063ee" }}>{p.userName?.slice(0, 2).toUpperCase()}</div>
                <div>
                  <div className="font-['Hanken_Grotesk'] font-semibold text-[16px]" style={{ color: T.ink }}>{p.userName}</div>
                  <div className="font-['Inter'] text-[12px]" style={{ color: T.muted }}>{timeAgo(p.createdAt)}</div>
                </div>
              </div>
            </div>
            <div className="font-['Hanken_Grotesk'] font-semibold text-[18px]" style={{ color: T.ink }}>{p.title}</div>
            <div className="font-['Inter'] text-[14px] line-clamp-3" style={{ color: T.muted }}>{p.content}</div>
            <div className="flex gap-4 pt-2 mt-1 font-['Inter'] text-[13px]" style={{ borderTop: "1px solid rgba(199,196,215,0.2)", color: T.muted }}>
              <span className="flex items-center gap-1"><ThumbsUp size={14} /> {p.likeCount}</span>
              <span className="flex items-center gap-1"><MessageCircle size={14} /> Comments</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
