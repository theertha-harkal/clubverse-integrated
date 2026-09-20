import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Calendar, Users2, Home, MessageCircle, User } from "lucide-react";
import { T, Pill, BottomNav, LoadingState, ErrorNotice, EmptyState } from "../../lib/ui";
import { EventsApi, ApiError } from "../../lib/api";
import { useAuth } from "../../lib/auth";

const TABS = ["Mine", "All"];
const STATUS_COLORS = {
  PUBLISHED: { bg: "rgba(108,248,187,0.2)", color: "#006c49" },
  PENDING: { bg: "rgba(255,218,214,0.4)", color: "#ba1a1a" },
  DRAFT: { bg: "#e5e0ff", color: T.muted },
  REJECTED: { bg: "#ffdad6", color: "#ba1a1a" },
  COMPLETED: { bg: "#e5e0ff", color: T.muted },
  CANCELLED: { bg: "#ffdad6", color: "#ba1a1a" },
};

export default function EventsManagement({ go, openEvent }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("Mine");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    EventsApi.list()
      .then((data) => { if (!cancelled) setEvents(data); })
      .catch((err) => { if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load events."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const visible = useMemo(() => {
    let list = events;
    if (tab === "Mine" && user) list = list.filter((e) => e.organizerId === user.id);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((e) => e.title.toLowerCase().includes(q));
    }
    return list;
  }, [events, tab, query, user]);

  return (
    <div className="flex flex-col pb-24">
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-10" style={{ background: T.page, boxShadow: "0px 1px 1px rgba(0,0,0,0.05)" }}>
        <div className="w-6" />
        <span className="font-['Hanken_Grotesk'] font-extrabold text-[24px]" style={{ color: T.primary }}>Clubverse</span>
        <div className="w-4" />
      </div>
      <div className="px-4 pt-6 flex flex-col gap-4">
        <div>
          <div className="font-['Hanken_Grotesk'] font-extrabold text-[24px]" style={{ color: T.ink }}>Event Management</div>
          <div className="font-['Inter'] text-[13px] mt-1" style={{ color: T.muted }}>Administer and track your organization's events.</div>
        </div>
        <div className="relative">
          <Search size={16} color={T.faint} className="absolute left-4 top-1/2 -translate-y-1/2" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events..." className="w-full rounded-full border pl-11 pr-4 py-3 font-['Inter'] text-[14.5px] outline-none" style={{ borderColor: "#c7c4d7" }} />
        </div>
        <div className="flex gap-2">
          {TABS.map((t) => <Pill key={t} active={t === tab} onClick={() => setTab(t)}>{t}</Pill>)}
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 mt-4">
        {error && <ErrorNotice text={error} />}
        {loading && <LoadingState label="Loading events…" />}
        {!loading && !error && visible.length === 0 && <EmptyState text="No events found." />}
        {visible.map(e => {
          const sc = STATUS_COLORS[e.status] || STATUS_COLORS.DRAFT;
          return (
            <div key={e.id} onClick={() => openEvent(e)} className="relative bg-white rounded-3xl p-3 flex gap-4 cursor-pointer" style={{ border: "1px solid rgba(199,196,215,0.3)", boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" }}>
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl" style={{ background: T.primary }} />
              <div className="w-24 h-24 rounded-lg relative shrink-0" style={{ background: e.posterUrl ? undefined : T.sky, backgroundImage: e.posterUrl ? `url(${e.posterUrl})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-['Hanken_Grotesk'] font-semibold text-[16px] leading-tight" style={{ color: T.ink }}>{e.title}</div>
                    <div className="flex items-center gap-1 mt-1 font-['Inter'] text-[11.5px]" style={{ color: T.muted }}><Calendar size={11} />{e.eventDate || "TBD"}</div>
                  </div>
                  <span className="rounded-full px-2 py-1 font-['Inter'] text-[9.5px] shrink-0" style={{ background: sc.bg, color: sc.color }}>{e.status}</span>
                </div>
                <div className="flex items-center justify-between pt-2 mt-1" style={{ borderTop: "1px solid rgba(199,196,215,0.2)" }}>
                  <span className="flex items-center gap-1.5 font-['Inter'] text-[12px]" style={{ color: T.ink }}>
                    <Users2 size={12} color={T.muted} /> {e.registeredCount}{e.maxRegistrations ? `/${e.maxRegistrations}` : ""} registered
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={() => go("createEvent")} className="fixed right-4 bottom-24 w-14 h-14 rounded-full flex items-center justify-center border-none cursor-pointer" style={{ background: T.primary, boxShadow: "0px 4px 10px rgba(70,72,212,0.4)" }}><Plus size={20} color="white" /></button>

      <div className="fixed bottom-0 w-[390px] left-1/2 -translate-x-1/2">
        <BottomNav active="eventsManagement" go={go} items={[
          { key: "dashboard", icon: Home, label: "Home" },
          { key: "clubProfile", icon: User, label: "Club" },
          { key: "eventsManagement", icon: Calendar, label: "Events" },
          { key: "notifications", icon: MessageCircle, label: "Messages" },
          { key: "settings", icon: User, label: "Profile" },
        ]} />
      </div>
    </div>
  );
}
