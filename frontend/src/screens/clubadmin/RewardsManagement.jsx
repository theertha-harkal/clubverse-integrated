import { Award, Plus, Trophy, Home, Calendar, MessageCircle, User } from "lucide-react";
import { T, StatCard, BottomNav } from "../../lib/ui";

const REWARDS = [
  { title: "Event Attendance", xp: 20, active: true },
  { title: "Volunteering (Standard)", xp: 150, active: true },
  { title: "Volunteering (High Demand)", xp: 500, active: true },
  { title: "Referral Bonus", xp: 50, active: false },
];

const LEADERS = [
  { name: "Priya Nair", xp: 1240 },
  { name: "Devon Clarke", xp: 980 },
  { name: "Maya Torres", xp: 875 },
];

export default function RewardsManagement({ go }) {
  return (
    <div className="flex flex-col pb-24">
      <div className="px-4 pt-3"><MockDataNotice text="Rewards/XP catalog isn't backed by the API yet — this screen is demo data." /></div>
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-10" style={{ background: T.page, boxShadow: "0px 1px 1px rgba(0,0,0,0.05)" }}>
        <div className="w-6" />
        <span className="font-['Hanken_Grotesk'] font-extrabold text-[22px]" style={{ color: T.primary }}>Rewards</span>
        <div className="w-4" />
      </div>
      <div className="px-4 pt-4 flex gap-3">
        <StatCard label="Total XP issued" value="12.4k" bg="rgba(255,185,95,0.15)" color="#825100" />
        <StatCard label="Active students" value="216" />
      </div>

      <div className="px-4 pt-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-['Hanken_Grotesk'] font-semibold text-[17px]" style={{ color: T.ink }}>Reward Rules</span>
          <Plus size={17} color={T.primary} />
        </div>
        {REWARDS.map(r => (
          <div key={r.title} className="bg-white rounded-2xl p-4 flex items-center justify-between" style={{ border: "1px solid rgba(199,196,215,0.3)", boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: r.active ? "rgba(255,185,95,0.2)" : T.page }}><Award size={15} color={r.active ? "#825100" : T.faint} /></div>
              <div>
                <div className="font-['Inter'] text-[14px]" style={{ color: T.ink }}>{r.title}</div>
                <div className="font-['Inter'] font-bold text-[12px]" style={{ color: "#825100" }}>+{r.xp} XP</div>
              </div>
            </div>
            <div className="w-9 h-5 rounded-full relative" style={{ background: r.active ? T.primary : "#e0e0e0" }}>
              <div className={`absolute w-3.5 h-3.5 rounded-full bg-white top-[3px] ${r.active ? "right-[3px]" : "left-[3px]"}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 pt-6 flex flex-col gap-3">
        <span className="font-['Hanken_Grotesk'] font-semibold text-[17px]" style={{ color: T.ink }}>Top Earners</span>
        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(199,196,215,0.3)" }}>
          {LEADERS.map((l, i) => (
            <div key={l.name} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < LEADERS.length - 1 ? "1px solid rgba(199,196,215,0.2)" : "none" }}>
              <Trophy size={15} color={i === 0 ? "#a36700" : T.faint} />
              <span className="flex-1 font-['Inter'] text-[14px]" style={{ color: T.ink }}>{l.name}</span>
              <span className="font-['Inter'] font-bold text-[13px]" style={{ color: "#825100" }}>{l.xp} XP</span>
            </div>
          ))}
        </div>
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
