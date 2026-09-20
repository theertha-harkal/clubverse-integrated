import { MessageCircle, Bell, Award, Home, Users, Calendar, User } from "lucide-react";
import { T, BottomNav, MockDataNotice } from "../../lib/ui";

const ITEMS = [
  { icon: MessageCircle, text: "Sarah Jenkins replied to your comment on \"Figma Advanced Prototyping Workshop\"", time: "10m ago", unread: true },
  { icon: Bell, text: "Reminder: HackTheCampus 2024 registration closes in 2 days", time: "1h ago", unread: true },
  { icon: Award, text: "You earned 150 XP for volunteering at the Welcome Desk", time: "1d ago", unread: false },
];

export default function Messages({ go }) {
  return (
    <div className="flex flex-col pt-6 pb-24">
      <div className="px-4 mb-4 font-['Hanken_Grotesk'] font-bold text-[24px]" style={{ color: T.ink }}>Messages</div>
      <div className="px-4 mb-4"><MockDataNotice text="No messaging/notifications backend exists yet — this list is demo data." /></div>
      <div className="flex flex-col px-4">
        {ITEMS.map((n, i) => (
          <div key={i} className="flex gap-3 items-start py-3" style={{ borderBottom: "1px solid rgba(199,196,215,0.3)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: n.unread ? T.primaryTint2 : T.page }}>
              <n.icon size={15} color={n.unread ? T.primary : T.faint} />
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
