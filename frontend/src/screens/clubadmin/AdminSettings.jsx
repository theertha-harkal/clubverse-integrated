import { User, LogOut, ChevronRight, Home, Calendar, MessageCircle } from "lucide-react";
import { T, BottomNav, MockDataNotice } from "../../lib/ui";
import { useAuth } from "../../lib/auth";

const SECTIONS = [
  { title: "Account", items: ["Edit profile", "Change password", "Linked email"] },
  { title: "Club", items: ["Club details", "Officer roles", "Notification preferences"] },
  { title: "Support", items: ["Contact Campus Life", "Help center"] },
];

export default function AdminSettings({ go }) {
  const { user, logout } = useAuth();
  const doLogout = () => { logout(); go("adminLogin"); };
  return (
    <div className="flex flex-col pb-24">
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-10" style={{ background: T.page, boxShadow: "0px 1px 1px rgba(0,0,0,0.05)" }}>
        <div className="w-6" />
        <span className="font-['Hanken_Grotesk'] font-extrabold text-[22px]" style={{ color: T.primary }}>Settings</span>
        <div className="w-4" />
      </div>
      <div className="px-4 pt-6 flex flex-col items-center gap-2">
        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: T.primaryTint2 }}><User size={28} color={T.primary} /></div>
        <div className="font-['Hanken_Grotesk'] font-bold text-[19px]" style={{ color: T.ink }}>{user?.name || "Club Admin"}</div>
        <div className="font-['Inter'] text-[13px]" style={{ color: T.muted }}>{user?.email}</div>
      </div>

      <div className="px-4 pt-4"><MockDataNotice text="These setting pages are placeholders — there's no settings/roles backend yet." /></div>

      <div className="px-4 pt-6 flex flex-col gap-6">
        {SECTIONS.map(s => (
          <div key={s.title}>
            <div className="font-['Inter'] font-bold text-[11px] tracking-wide uppercase mb-2 px-1" style={{ color: T.muted }}>{s.title}</div>
            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(199,196,215,0.3)" }}>
              {s.items.map((it, i) => (
                <div key={it} className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: i < s.items.length - 1 ? "1px solid rgba(199,196,215,0.2)" : "none" }}>
                  <span className="font-['Inter'] text-[14.5px]" style={{ color: T.ink }}>{it}</span>
                  <ChevronRight size={15} color={T.faint} />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={doLogout} className="w-full py-3 rounded-lg font-['Inter'] font-semibold text-[14px] flex items-center justify-center gap-2 border cursor-pointer" style={{ borderColor: "#ef4444", color: "#ef4444" }}>
          <LogOut size={15} /> Log out
        </button>
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
