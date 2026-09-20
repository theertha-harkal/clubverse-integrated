import { Award, Users2, LogOut, ChevronRight, Home, Users, Calendar, MessageCircle, User } from "lucide-react";
import { T, BottomNav, MockDataNotice } from "../../lib/ui";
import { useAuth } from "../../lib/auth";

export default function Profile({ go }) {
  const { user, logout } = useAuth();

  const doLogout = () => {
    logout();
    go("login");
  };

  return (
    <div className="flex flex-col pt-8 pb-24 px-4">
      <div className="flex flex-col items-center gap-2 mb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center font-['Hanken_Grotesk'] font-bold text-[28px] text-white" style={{ background: T.primary }}>{user?.name?.[0]?.toUpperCase() || "?"}</div>
        <div className="font-['Hanken_Grotesk'] font-bold text-[22px]" style={{ color: T.ink }}>{user?.name || "Not signed in"}</div>
        <div className="font-['Inter'] text-[13px]" style={{ color: T.muted }}>{user?.email}</div>
      </div>

      <MockDataNotice text="XP and community-count below are demo values — the backend doesn't track XP or club membership yet." />

      <div className="flex gap-3 my-6">
        <div className="flex-1 rounded-2xl p-4" style={{ background: T.primaryTint }}>
          <Award size={16} color={T.primary} />
          <div className="font-['Hanken_Grotesk'] font-extrabold text-[20px] mt-1" style={{ color: T.primary }}>—</div>
          <div className="font-['Inter'] text-[11px]" style={{ color: T.primary }}>XP earned</div>
        </div>
        <div className="flex-1 rounded-2xl p-4" style={{ background: T.page, border: "1px solid #c7c4d7" }}>
          <Users2 size={16} color={T.ink} />
          <div className="font-['Hanken_Grotesk'] font-extrabold text-[20px] mt-1" style={{ color: T.ink }}>—</div>
          <div className="font-['Inter'] text-[11px]" style={{ color: T.muted }}>Communities</div>
        </div>
      </div>

      <div className="flex flex-col rounded-2xl overflow-hidden" style={{ border: "1px solid #c7c4d7" }}>
        {["My Posts", "My Registrations", "Volunteer Applications"].map((item, i) => (
          <div key={item} onClick={() => item === "My Registrations" ? go("events") : item === "Volunteer Applications" ? go("volunteerOps") : go("home")} className="flex items-center justify-between px-4 py-3.5 cursor-pointer" style={{ borderBottom: i < 2 ? "1px solid #eee" : "none" }}>
            <span className="font-['Inter'] text-[14.5px]" style={{ color: T.ink }}>{item}</span>
            <ChevronRight size={15} color={T.faint} />
          </div>
        ))}
      </div>

      <button onClick={doLogout} className="mt-6 w-full py-3 rounded-lg font-['Inter'] font-semibold text-[14px] flex items-center justify-center gap-2 border cursor-pointer" style={{ borderColor: "#ef4444", color: "#ef4444" }}>
        <LogOut size={15} /> Log out
      </button>

      <div className="fixed bottom-0 w-[390px] left-1/2 -translate-x-1/2">
        <BottomNav active="profile" go={go} items={[
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
