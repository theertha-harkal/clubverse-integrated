import { FileClock, ShieldCheck, Trash2, UserCog, CalendarCheck2 } from "lucide-react";
import { T, MockDataNotice, Card, Pill } from "../../lib/ui";
import CampusShell from "./Shell";

const LOGS = [
  { icon: Trash2, actor: "campus-admin@university.edu", action: "Removed a post in Confessions", time: "Oct 15, 10:22 AM" },
  { icon: CalendarCheck2, actor: "campus-admin@university.edu", action: "Approved event: Golden Hour UI/UX Workshop", time: "Oct 15, 9:47 AM" },
  { icon: UserCog, actor: "system", action: "AI moderation auto-flagged a post in CS201 Batch", time: "Oct 15, 8:03 AM" },
  { icon: ShieldCheck, actor: "campus-admin@university.edu", action: "Resolved report #4021 (no action taken)", time: "Oct 14, 6:15 PM" },
];

export default function AuditLogs({ go }) {
  return (
    <CampusShell go={go} active="auditLogs" title="Audit Logs" subtitle="A record of moderation and admin actions on the platform.">
      <MockDataNotice text="No audit-log entity exists on the backend — this log is demo data." />
      <div className="flex gap-2 mb-6">
        {["All", "Moderation", "Events", "System"].map((f, i) => <Pill key={f} active={i === 0}>{f}</Pill>)}
      </div>
      <Card className="!p-0 overflow-hidden">
        {LOGS.map((l, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4" style={{ borderBottom: i < LOGS.length - 1 ? "1px solid #e5e3ef" : "none" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: T.primaryTint }}><l.icon size={15} color={T.primary} /></div>
            <div className="flex-1">
              <div className="font-['Inter'] text-[14px]" style={{ color: T.ink }}>{l.action}</div>
              <div className="font-['Inter'] text-[12px]" style={{ color: T.muted }}>{l.actor}</div>
            </div>
            <span className="font-['Inter'] text-[12.5px]" style={{ color: T.faint }}>{l.time}</span>
          </div>
        ))}
      </Card>
    </CampusShell>
  );
}
