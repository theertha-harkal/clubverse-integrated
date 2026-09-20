import { useEffect, useMemo, useState } from "react";
import { Bell, CalendarCheck2, ClipboardList, HeartHandshake, Users2, Plus, Megaphone, HandHeart, Clock, Home, Calendar, MessageCircle, User } from "lucide-react";
import { T, BottomNav, MockDataNotice } from "../../lib/ui";
import { EventsApi, ApiError } from "../../lib/api";
import { useAuth } from "../../lib/auth";

export default function AdminDashboard({ go }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    EventsApi.list()
      .then((all) => { if (!cancelled) setEvents(user ? all.filter((e) => e.organizerId === user.id) : all); })
      .catch((err) => { if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load your events."); });
    return () => { cancelled = true; };
  }, [user]);

  const upcoming = useMemo(() => events.filter((e) => e.status === "PUBLISHED" || e.status === "PENDING"), [events]);
  const totalRegistrations = useMemo(() => events.reduce((sum, e) => sum + (e.registeredCount || 0), 0), [events]);

  const stats = [
    { label: "UPCOMING EVENTS", value: upcoming.length, icon: CalendarCheck2, bar: T.mint },
    { label: "REGISTRATIONS", value: totalRegistrations, icon: ClipboardList },
    { label: "VOLUNTEERS", value: "—", icon: HeartHandshake, bar: "#ffddb8", mock: true },
    { label: "CLUB MEMBERS", value: "—", icon: Users2, mock: true },
  ];

  return (
    <div className="flex flex-col gap-8 pb-24">
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-10" style={{ background: T.page, boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
        <div className="w-6" />
        <div className="flex items-center gap-1 rounded-lg px-3 py-1.5" style={{ background: T.primaryTint }}>
          <span className="font-['Inter'] font-semibold text-[13.5px]" style={{ color: T.ink }}>{user?.name || "Club Admin"}</span>
        </div>
        <button onClick={() => go("notifications")} className="bg-transparent border-none cursor-pointer"><Bell size={17} color={T.ink} /></button>
      </div>

      <div className="px-4">
        <div className="font-['Hanken_Grotesk'] font-extrabold text-[34px] leading-tight" style={{ color: T.ink }}>Welcome back,</div>
        <div className="font-['Hanken_Grotesk'] font-bold text-[26px]" style={{ color: T.primary }}>{user?.name || "Club Admin"}</div>
      </div>

      <div className="px-4"><MockDataNotice text="Volunteer/member counts are placeholders — there's no club-membership entity on the backend. Events & registrations below are real." /></div>

      <div className="grid grid-cols-2 gap-4 px-4">
        {stats.map(s => (
          <div key={s.label} className="relative bg-white rounded-3xl p-5 flex flex-col gap-3" style={{ border: "1px solid #c7c4d7", boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" }}>
            {s.bar && <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl" style={{ background: s.bar }} />}
            <div className="flex items-center justify-between">
              <span className="font-['Inter'] font-bold text-[10.5px] tracking-wide" style={{ color: T.muted }}>{s.label}</span>
              <s.icon size={17} color={T.muted} />
            </div>
            <div className="font-['Hanken_Grotesk'] font-extrabold text-[34px]" style={{ color: T.ink }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="px-4 flex flex-col gap-3">
        <div className="font-['Hanken_Grotesk'] font-semibold text-[18px]" style={{ color: T.ink }}>Quick Actions</div>
        <button onClick={() => go("createEvent")} className="rounded-full py-3 flex items-center justify-center gap-2 text-white font-['Inter'] font-semibold text-[15px] border-none cursor-pointer" style={{ background: T.primary }}><Plus size={17} /> Create Event</button>
        <button onClick={() => go("createAnnouncement")} className="rounded-full py-3 flex items-center justify-center gap-2 font-['Inter'] font-semibold text-[15px] border-2 cursor-pointer" style={{ borderColor: T.primary, color: T.primary, background: "white" }}><Megaphone size={16} /> Announcement</button>
        <button onClick={() => go("volunteersOverview")} className="rounded-full py-3 flex items-center justify-center gap-2 font-['Inter'] font-semibold text-[15px] border-2 cursor-pointer" style={{ borderColor: "#c7c4d7", color: T.ink, background: "white" }}><HandHeart size={17} /> Add Volunteer Op</button>
      </div>

      <div className="px-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-['Hanken_Grotesk'] font-semibold text-[18px]" style={{ color: T.ink }}>Upcoming Events</span>
          <span onClick={() => go("eventsManagement")} className="font-['Inter'] font-bold text-[11px] tracking-wide cursor-pointer" style={{ color: T.primary }}>MANAGE</span>
        </div>
        {upcoming.length === 0 && <div className="font-['Inter'] text-[13px]" style={{ color: T.faint }}>No upcoming events yet.</div>}
        {upcoming.slice(0, 3).map(e => (
          <div key={e.id} onClick={() => go("eventsManagement")} className="relative bg-white rounded-3xl p-5 flex gap-4 cursor-pointer" style={{ border: "1px solid #c7c4d7", boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" }}>
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl" style={{ background: T.mint }} />
            <div className="rounded-xl px-3 py-2 flex flex-col items-center" style={{ background: "#dce9ff" }}>
              <span className="font-['Inter'] font-bold text-[11px]" style={{ color: T.primary }}>{(e.eventDate || "").slice(5, 7)}</span>
              <span className="font-['Hanken_Grotesk'] font-semibold text-[18px]" style={{ color: T.ink }}>{(e.eventDate || "").slice(8, 10) || "?"}</span>
            </div>
            <div className="flex-1">
              <div className="font-['Hanken_Grotesk'] font-semibold text-[17px]" style={{ color: T.ink }}>{e.title}</div>
              <div className="flex items-center gap-1 mt-1 font-['Inter'] text-[13px]" style={{ color: T.muted }}><Clock size={12} />{e.startTime}</div>
              <span className="inline-block mt-2 rounded-full px-2.5 py-1 font-['Inter'] font-bold text-[10.5px] tracking-wide" style={{ background: "rgba(96,99,238,0.1)", color: T.primary }}>{e.registeredCount}{e.maxRegistrations ? `/${e.maxRegistrations}` : ""} REGISTERED</span>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 w-[390px] left-1/2 -translate-x-1/2">
        <BottomNav active="dashboard" go={go} items={[
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
