import { useEffect, useState } from "react";
import { ArrowLeft, Search as SearchIcon, X } from "lucide-react";
import { T, LoadingState, EmptyState } from "../../lib/ui";
import { PostsApi, EventsApi } from "../../lib/api";

export default function Search({ go, openPost, openEvent }) {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([PostsApi.list().catch(() => []), EventsApi.list().catch(() => [])])
      .then(([p, e]) => { setPosts(p); setEvents(e); })
      .finally(() => setLoading(false));
  }, []);

  const q = query.trim().toLowerCase();
  const matchedPosts = q ? posts.filter((p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) || (p.community || "").toLowerCase().includes(q)) : [];
  const matchedEvents = q ? events.filter((e) => e.title.toLowerCase().includes(q) || (e.venue || "").toLowerCase().includes(q)) : [];

  return (
    <div className="flex flex-col pb-10 min-h-full">
      <div className="flex items-center gap-3 px-4 py-3 sticky top-0 z-10" style={{ background: T.page, boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
        <button onClick={() => go("home")} className="bg-transparent border-none cursor-pointer"><ArrowLeft size={18} color={T.ink} /></button>
        <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-4 py-2.5" style={{ border: "1px solid rgba(199,196,215,0.5)" }}>
          <SearchIcon size={15} color={T.faint} />
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search posts, events, communities…" className="flex-1 outline-none font-['Inter'] text-[14px] bg-transparent" />
          {query && <button onClick={() => setQuery("")} className="bg-transparent border-none cursor-pointer"><X size={14} color={T.faint} /></button>}
        </div>
      </div>

      <div className="flex flex-col gap-6 px-4 pt-6">
        {loading && <LoadingState label="Loading…" />}
        {!loading && !q && <EmptyState text="Start typing to search posts and events." />}
        {!loading && q && matchedPosts.length === 0 && matchedEvents.length === 0 && <EmptyState text={`No results for "${query}"`} />}

        {matchedEvents.length > 0 && (
          <div>
            <div className="font-['Hanken_Grotesk'] font-semibold text-[16px] mb-2" style={{ color: T.ink }}>Events</div>
            <div className="flex flex-col gap-2">
              {matchedEvents.map((e) => (
                <div key={e.id} onClick={() => openEvent && openEvent(e)} className="bg-white rounded-xl p-3 cursor-pointer" style={{ border: "1px solid rgba(199,196,215,0.3)" }}>
                  <div className="font-['Inter'] font-semibold text-[14px]" style={{ color: T.ink }}>{e.title}</div>
                  <div className="font-['Inter'] text-[12px]" style={{ color: T.muted }}>{e.venue}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {matchedPosts.length > 0 && (
          <div>
            <div className="font-['Hanken_Grotesk'] font-semibold text-[16px] mb-2" style={{ color: T.ink }}>Posts</div>
            <div className="flex flex-col gap-2">
              {matchedPosts.map((p) => (
                <div key={p.id} onClick={() => openPost && openPost(p)} className="bg-white rounded-xl p-3 cursor-pointer" style={{ border: "1px solid rgba(199,196,215,0.3)" }}>
                  <div className="font-['Inter'] font-semibold text-[14px]" style={{ color: T.ink }}>{p.title}</div>
                  <div className="font-['Inter'] text-[12px] line-clamp-1" style={{ color: T.muted }}>{p.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
