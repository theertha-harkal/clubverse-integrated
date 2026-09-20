import { useEffect, useMemo, useState } from "react";
import { TrendingUp, Calendar, MapPin, Home, Users, MessageCircle, User } from "lucide-react";
import { T, Pill, BottomNav, LoadingState, ErrorNotice, EmptyState } from "../../lib/ui";
import { EventsApi, ApiError } from "../../lib/api";

const FILTERS = ["All", "Published", "Pending approval"];

function fmtWhen(eventDate, startTime) {
  if (!eventDate) return "TBD";
  const d = new Date(`${eventDate}T${startTime || "00:00:00"}`);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function EventsFeed({ go, openEvent }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    let cancelled = false;
    EventsApi.list()
      .then((data) => { if (!cancelled) setEvents(data); })
      .catch((err) => { if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load events."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const visible = useMemo(() => {
    if (filter === "All") return events;
    if (filter === "Published") return events.filter((e) => e.status === "PUBLISHED");
    return events.filter((e) => e.status === "PENDING");
  }, [events, filter]);

  return (
    <div className="flex flex-col items-center gap-4 pt-8 pb-24">
      <div className="w-full px-4">
        <div className="font-['Hanken_Grotesk'] font-bold text-[26px]" style={{ color: T.ink }}>Discover Events</div>
      </div>

      <div className="flex gap-3 overflow-x-auto w-full px-4">
        {FILTERS.map((f) => <Pill key={f} active={f === filter} onClick={() => setFilter(f)}>{f}</Pill>)}
      </div>

      <div className="flex flex-col gap-6 w-full px-4">
        {error && <ErrorNotice text={error} />}
        {loading && <LoadingState label="Loading events…" />}
        {!loading && !error && visible.length === 0 && <EmptyState text="No events to show." />}
        {visible.map((e, i) => (
          <div key={e.id} onClick={() => openEvent(e)} className="relative bg-white rounded-3xl overflow-hidden cursor-pointer" style={{ border: "1px solid #d5e3fc", boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" }}>
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: i === 0 ? T.primary : "#4edea3" }} />
            <div className={`w-full ${i === 0 ? "h-[170px]" : "h-[140px]"} relative`} style={{ background: e.posterUrl ? undefined : T.sky, backgroundImage: e.posterUrl ? `url(${e.posterUrl})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}>
              {i === 0 && (
                <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full px-3 py-1" style={{ background: "rgba(70,72,212,0.9)" }}>
                  <TrendingUp size={11} color="white" /><span className="text-white font-['Inter'] font-bold text-[11px]">Featured</span>
                </div>
              )}
            </div>
            <div className="p-5 flex flex-col gap-1">
              <div className="flex gap-2 items-center">
                <span className="rounded-full px-2 py-1 font-['Inter'] font-bold text-[11px]" style={{ background: "#d5e3fc", color: T.primary }}>{e.status}</span>
                <span className="font-['Inter'] text-[13px]" style={{ color: T.muted }}>{e.organizerName}</span>
              </div>
              <div className="font-['Hanken_Grotesk'] font-semibold text-[18px] mt-1" style={{ color: T.ink }}>{e.title}</div>
              {e.description && <div className="font-['Inter'] text-[13.5px] mt-1 line-clamp-2" style={{ color: T.muted }}>{e.description}</div>}
              <div className="flex flex-col gap-1 mt-3 font-['Inter'] text-[13.5px]" style={{ color: T.ink }}>
                <span className="flex items-center gap-2"><Calendar size={13} color={T.muted} />{fmtWhen(e.eventDate, e.startTime)}</span>
                <span className="flex items-center gap-2" style={{ color: T.muted }}><MapPin size={13} />{e.venue}</span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid #d5e3fc" }}>
                <span className="font-['Inter'] font-bold text-[11px] tracking-wide" style={{ color: T.muted }}>{e.maxRegistrations ? `${e.registeredCount ?? 0}/${e.maxRegistrations} registered` : ""}</span>
                <span className="font-['Inter'] font-bold text-[11px] tracking-wide" style={{ color: T.primary }}>Details</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 w-[390px]">
        <BottomNav active="events" go={go} items={[
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
