import { Search, UserPlus, Home, Calendar, MessageCircle, User } from "lucide-react";
import { T, Pill, Tag, BottomNav } from "../../lib/ui";

const MEMBERS = [
  { name: "Sarah Jenkins", role: "President", since: "Since Aug 2023" },
  { name: "Mark Chen", role: "Events Lead", since: "Since Aug 2023" },
  { name: "Priya Nair", role: "Member", since: "Since Jan 2024" },
  { name: "Devon Clarke", role: "Member", since: "Since Feb 2024" },
  { name: "Maya Torres", role: "Treasurer", since: "Since Sep 2023" },
];

export default function ClubMembers({ go }) {
  return (
    <div className="flex flex-col pb-24">
      <div className="px-4 pt-3"><MockDataNotice text="Member roster is demo data — there's no club-membership entity on the backend." /></div>
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-10" style={{ background: T.page, boxShadow: "0px 1px 1px rgba(0,0,0,0.05)" }}>
        <div className="w-6" />
        <span className="font-['Hanken_Grotesk'] font-extrabold text-[22px]" style={{ color: T.primary }}>Club Members</span>
        <UserPlus size={17} color={T.ink} />
      </div>
      <div className="px-4 pt-4 flex flex-col gap-4">
        <div className="relative">
          <Search size={16} color={T.faint} className="absolute left-4 top-1/2 -translate-y-1/2" />
          <input placeholder="Search members..." className="w-full rounded-full border pl-11 pr-4 py-3 font-['Inter'] text-[14.5px] outline-none" style={{ borderColor: "#c7c4d7" }} />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {["All (85)", "Officers", "Members"].map((f, i) => <Pill key={f} active={i === 0}>{f}</Pill>)}
        </div>
      </div>
      <div className="flex flex-col gap-3 px-4 mt-4">
        {MEMBERS.map(m => (
          <div key={m.name} className="bg-white rounded-2xl p-4 flex items-center gap-3" style={{ border: "1px solid rgba(199,196,215,0.3)", boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
            <div className="w-11 h-11 rounded-full shrink-0" style={{ background: "#dce9ff" }} />
            <div className="flex-1">
              <div className="font-['Hanken_Grotesk'] font-semibold text-[15px]" style={{ color: T.ink }}>{m.name}</div>
              <div className="font-['Inter'] text-[12px]" style={{ color: T.muted }}>{m.since}</div>
            </div>
            <Tag bg={m.role === "Member" ? T.page : "rgba(96,99,238,0.1)"} color={m.role === "Member" ? T.muted : T.primary}>{m.role}</Tag>
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 w-[390px] left-1/2 -translate-x-1/2">
        <BottomNav active="clubProfile" go={go} items={[
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
