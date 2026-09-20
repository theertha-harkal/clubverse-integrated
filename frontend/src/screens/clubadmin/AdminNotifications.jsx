import { ClipboardList, HeartHandshake, AlertTriangle, MessageCircle, Home, Calendar, User } from "lucide-react";
import { T, Pill, BottomNav } from "../../lib/ui";

const ITEMS = [
  { icon: ClipboardList, text: "3 new registrations for Golden Hour UI/UX Workshop", time: "10m ago", unread: true },
  { icon: HeartHandshake, text: "Devon Clarke applied to volunteer as Welcome Desk Host", time: "1h ago", unread: true },
  { icon: AlertTriangle, text: "Financial Literacy 101 is missing venue approval", time: "3h ago", unread: false, warn: true },
  { icon: MessageCircle, text: "New comment on your Spring Fest announcement", time: "1d ago", unread: false },
];

export default function AdminNotifications({ go }) {
  return (
    <div className="flex flex-col pb-24">
      <div className="px-4 pt-3"><MockDataNotice text="No notifications backend exists yet — this list is demo data." /></div>
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-10" style={{ background: T.page, boxShadow: "0px 1px 1px rgba(0,0,0,0.05)" }}>
        <div className="w-6" />
        <span className="font-['Hanken_Grotesk'] font-extrabold text-[22px]" style={{ color: T.primary }}>Notifications</span>
        <div className="w-4" />
      </div>
      <div className="flex gap-2 px-4 pt-4 overflow-x-auto">
        {["All", "Registrations", "Volunteers", "Alerts"].map((f, i) => <Pill key={f} active={i === 0}>{f}</Pill>)}
      </div>
      <div className="flex flex-col px-4 mt-3">
        {ITEMS.map((n, i) => (
          <div key={i} className="flex gap-3 items-start py-3" style={{ borderBottom: "1px solid rgba(199,196,215,0.3)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: n.warn ? "rgba(255,218,214,0.4)" : n.unread ? T.primaryTint2 : T.page }}>
              <n.icon size={15} color={n.warn ? "#ba1a1a" : n.unread ? T.primary : T.faint} />
            </div>
            <div className="flex-1">
              <div className="font-['Inter'] text-[13.5px]" style={{ color: n.unread ? T.ink : T.muted }}>{n.text}</div>
              <div className="font-['Inter'] text-[11.5px] mt-1" style={{ color: T.faint }}>{n.time}</div>
            </div>
            {n.unread && <div className="w-2 h-2 rounded-full mt-1" style={{ background: T.primary }} />}
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 w-[390px] left-1/2 -translate-x-1/2">
        <BottomNav active="notifications" go={go} items={[
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
