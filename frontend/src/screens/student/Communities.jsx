import { useEffect, useMemo, useState } from "react";
import { Menu, Search as SearchIcon, Home, Users, Calendar, MessageCircle, User } from "lucide-react";
import { T, Tag, BottomNav, LoadingState, ErrorNotice, EmptyState } from "../../lib/ui";
import { PostsApi, ApiError } from "../../lib/api";

// ClubVerse's backend has no separate "community"/"club" entity - a Post
// simply carries a free-text `community` field (see PostRequest/PostResponse
// on the backend). So "communities" here are derived from that field on the
// existing posts, grouped client-side, rather than fetched from their own
// endpoint (which doesn't exist).
function CommunityCard({ letter, title, postCount, onClick }) {
  return (
    <div onClick={onClick} className="bg-white rounded-3xl p-5 flex flex-col gap-4 cursor-pointer w-full" style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#6063ee" }}>
          <span className="font-['Hanken_Grotesk'] font-semibold text-white text-[18px]">{letter}</span>
        </div>
        <Tag bg="rgba(70,72,212,0.1)" color={T.primary}>COMMUNITY</Tag>
      </div>
      <div>
        <div className="font-['Hanken_Grotesk'] font-semibold text-[19px]" style={{ color: T.ink }}>{title}</div>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-['Inter'] text-[13px]" style={{ color: T.faint }}>{postCount} post{postCount === 1 ? "" : "s"}</span>
      </div>
    </div>
  );
}

export default function Communities({ go, openCommunity }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    PostsApi.list()
      .then((data) => { if (!cancelled) setPosts(data); })
      .catch((err) => { if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load communities."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const communities = useMemo(() => {
    const map = new Map();
    posts.forEach((p) => {
      const name = p.community || "General";
      map.set(name, (map.get(name) || 0) + 1);
    });
    return Array.from(map.entries()).map(([title, postCount]) => ({ title, postCount }));
  }, [posts]);

  return (
    <div className="flex flex-col pb-24">
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-10" style={{ background: T.page, boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
        <Menu size={20} color={T.ink} />
        <span className="font-['Hanken_Grotesk'] font-extrabold text-[24px]" style={{ color: T.primary }}>Clubverse</span>
        <button onClick={() => go("search")} className="bg-transparent border-none cursor-pointer"><SearchIcon size={18} color={T.ink} /></button>
      </div>

      <div className="flex flex-col gap-8 px-4 pt-8">
        <div>
          <div className="font-['Hanken_Grotesk'] font-extrabold text-[36px] tracking-tight" style={{ color: T.ink }}>Communities</div>
          <div className="font-['Inter'] text-[14.5px] mt-2" style={{ color: T.muted }}>Communities are derived from what people post under - there's no separate join/membership system on the backend yet.</div>
        </div>

        {error && <ErrorNotice text={error} />}
        {loading && <LoadingState label="Loading communities…" />}
        {!loading && !error && communities.length === 0 && <EmptyState text="No communities yet — posts will create them." />}

        <div className="flex flex-col gap-4 pb-8">
          {communities.map((c) => (
            <CommunityCard key={c.title} letter={c.title[0]?.toUpperCase()} title={c.title} postCount={c.postCount} onClick={() => openCommunity && openCommunity(c)} />
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 w-[390px]">
        <BottomNav active="communities" go={go} items={[
          { key: "home", icon: Home, label: "Home" },
          { key: "communities", icon: Users, label: "Communities" },
          { key: "events", icon: Calendar, label: "Events" },
          { key: "notifications", icon: MessageCircle, label: "Messages" },
          { key: "profile", icon: User, label: "Profile" },
        ]} />
      </div>
    </div>
  );
}
