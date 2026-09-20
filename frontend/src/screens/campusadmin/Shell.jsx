import { LayoutDashboard, ShieldAlert, Flag, CalendarCheck2, Megaphone, Users2, BarChart3, FileClock, Settings, Bell, LogOut } from "lucide-react";
import { T, AdminSidebar } from "../../lib/ui";
import { useAuth } from "../../lib/auth";

export const CAMPUS_NAV = [
  { key: "campusDashboard", icon: LayoutDashboard, label: "Dashboard" },
  { key: "moderationQueue", icon: ShieldAlert, label: "Moderation" },
  { key: "reportsManagement", icon: Flag, label: "Reports" },
  { key: "eventApprovalQueue", icon: CalendarCheck2, label: "Event Approvals" },
  { key: "campusAnnouncements", icon: Megaphone, label: "Announcements" },
  { key: "studentManagement", icon: Users2, label: "Students" },
  { key: "campusAnalytics", icon: BarChart3, label: "Analytics" },
  { key: "auditLogs", icon: FileClock, label: "Audit Logs" },
  { key: "campusSettings", icon: Settings, label: "Settings" },
];

export default function CampusShell({ go, active, title, subtitle, children }) {
  const { user, logout } = useAuth();
  const doLogout = () => { logout(); go("campusLogin"); };
  return (
    <div className="flex w-full h-full">
      <AdminSidebar items={CAMPUS_NAV} active={active} go={go} title="Clubverse Campus" />
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: T.page }}>
        <div className="flex items-center justify-between px-8 py-5" style={{ background: "white", borderBottom: "1px solid #e5e3ef" }}>
          <div>
            <div className="font-['Hanken_Grotesk'] font-bold text-[22px]" style={{ color: T.ink }}>{title}</div>
            {subtitle && <div className="font-['Inter'] text-[13px] mt-0.5" style={{ color: T.muted }}>{subtitle}</div>}
          </div>
          <div className="flex items-center gap-4">
            <Bell size={18} color={T.muted} />
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-['Inter'] font-bold text-[13px]" style={{ background: T.primaryTint2, color: T.primary }} title={user?.name}>{user?.name?.[0]?.toUpperCase() || "?"}</div>
            <button onClick={doLogout} className="bg-transparent border-none cursor-pointer"><LogOut size={17} color={T.muted} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </div>
    </div>
  );
}
