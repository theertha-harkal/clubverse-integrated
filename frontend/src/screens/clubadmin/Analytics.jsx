import { TrendingUp, Users2, CalendarCheck2, Award, Home, Calendar, MessageCircle, User } from "lucide-react";
import { T, StatCard, BottomNav } from "../../lib/ui";

const MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
const VALUES = [40, 65, 50, 90, 120, 142];

export default function Analytics({ go }) {
  const max = Math.max(...VALUES);
  return (
    <div className="flex flex-col pb-24">
      <div className="px-4 pt-3"><MockDataNotice text="Analytics aren't backed by the API yet — these charts are demo data." /></div>
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-10" style={{ background: T.page, boxShadow: "0px 1px 1px rgba(0,0,0,0.05)" }}>
        <div className="w-6" />
        <span className="font-['Hanken_Grotesk'] font-extrabold text-[22px]" style={{ color: T.primary }}>Analytics</span>
        <div className="w-4" />
      </div>

      <div className="px-4 pt-4 grid grid-cols-2 gap-3">
        <StatCard label="Total members" value="85" />
        <StatCard label="Events this term" value="9" bg="rgba(108,248,187,0.2)" color="#00714d" />
        <StatCard label="Avg. attendance" value="82%" bg="rgba(255,185,95,0.15)" color="#825100" />
        <StatCard label="XP distributed" value="12.4k" bg="rgba(96,99,238,0.1)" />
      </div>

      <div className="px-4 pt-6">
        <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid rgba(199,196,215,0.3)", boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center gap-2 mb-4"><TrendingUp size={16} color={T.primary} /><span className="font-['Hanken_Grotesk'] font-semibold text-[16px]" style={{ color: T.ink }}>Registrations over time</span></div>
          <div className="flex items-end justify-between h-32 gap-2">
            {VALUES.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t" style={{ height: `${(v / max) * 100}px`, background: T.primary, opacity: 0.4 + (i / VALUES.length) * 0.6 }} />
                <span className="font-['Inter'] text-[10.5px]" style={{ color: T.muted }}>{MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-6 flex flex-col gap-3">
        <span className="font-['Hanken_Grotesk'] font-semibold text-[16px]" style={{ color: T.ink }}>Member growth by category</span>
        {[{ l: "Tech workshops", v: 68, icon: CalendarCheck2 }, { l: "Social events", v: 52, icon: Users2 }, { l: "Volunteering", v: 34, icon: Award }].map(c => (
          <div key={c.l} className="bg-white rounded-xl p-4" style={{ border: "1px solid rgba(199,196,215,0.3)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 font-['Inter'] text-[13.5px]" style={{ color: T.ink }}><c.icon size={14} color={T.primary} />{c.l}</span>
              <span className="font-['Inter'] font-bold text-[13px]" style={{ color: T.primary }}>{c.v}%</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: T.page }}>
              <div className="h-2 rounded-full" style={{ width: `${c.v}%`, background: T.primary }} />
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 w-[390px] left-1/2 -translate-x-1/2">
        <BottomNav active="settings" go={go} items={[
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
