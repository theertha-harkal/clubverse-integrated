import { useEffect, useState } from "react";
import { ShieldAlert, CalendarCheck2, Flag, TrendingUp } from "lucide-react";
import { T, StatCard, Card, MockDataNotice } from "../../lib/ui";
import { EventsApi, ReportsApi, ApiError } from "../../lib/api";
import CampusShell from "./Shell";

export default function CampusDashboard({ go }) {
  const [pendingEvents, setPendingEvents] = useState(0);
  const [openReports, setOpenReports] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      EventsApi.list().catch(() => []),
      ReportsApi.list().catch(() => []),
    ]).then(([events, reports]) => {
      if (cancelled) return;
      setPendingEvents(events.filter((e) => e.status === "PENDING").length);
      setOpenReports(Array.isArray(reports) ? reports.filter((r) => r.status === "NEW" || r.status === "PENDING").length : 0);
    }).catch((err) => { if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load dashboard stats."); });
    return () => { cancelled = true; };
  }, []);

  const stats = [
    { label: "Open Reports", value: String(openReports), bg: "rgba(255,218,214,0.4)", color: "#ba1a1a" },
    { label: "Pending Event Approvals", value: String(pendingEvents), bg: "rgba(255,185,95,0.2)", color: "#825100" },
    { label: "Active Students", value: "—", mock: true },
    { label: "Active Clubs", value: "—", bg: "rgba(108,248,187,0.25)", color: "#00714d", mock: true },
  ];

  return (
    <CampusShell go={go} active="campusDashboard" title="Campus Admin Dashboard" subtitle="Here's what's happening across campus today.">
      <MockDataNotice text="Active-student and active-club counts are placeholders — there's no roster/club entity on the backend. Report and event-approval counts above are real." />
      <div className="grid grid-cols-4 gap-4 mb-8 mt-4">
        {stats.map(s => <StatCard key={s.label} label={s.label} value={s.value} bg={s.bg} color={s.color} />)}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <div className="flex items-center gap-2 mb-4"><TrendingUp size={16} color={T.primary} /><span className="font-['Hanken_Grotesk'] font-semibold text-[17px]" style={{ color: T.ink }}>Platform activity</span></div>
            <MockDataNotice text="No analytics/activity-log endpoint exists on the backend yet." />
          </Card>
        </div>
        <Card>
          <div className="font-['Hanken_Grotesk'] font-semibold text-[17px] mb-4" style={{ color: T.ink }}>Quick links</div>
          <div className="flex flex-col gap-3">
            <div onClick={() => go("eventApprovalQueue")} className="flex gap-3 items-center cursor-pointer">
              <CalendarCheck2 size={15} color={T.primary} />
              <span className="font-['Inter'] text-[13.5px]" style={{ color: T.ink }}>Review pending events ({pendingEvents})</span>
            </div>
            <div onClick={() => go("reportsManagement")} className="flex gap-3 items-center cursor-pointer">
              <Flag size={15} color={T.primary} />
              <span className="font-['Inter'] text-[13.5px]" style={{ color: T.ink }}>Review open reports ({openReports})</span>
            </div>
            <div onClick={() => go("campusAnnouncements")} className="flex gap-3 items-center cursor-pointer">
              <ShieldAlert size={15} color={T.primary} />
              <span className="font-['Inter'] text-[13.5px]" style={{ color: T.ink }}>Published announcements</span>
            </div>
          </div>
        </Card>
      </div>
      {error && <div className="mt-4"><MockDataNotice text={error} /></div>}
    </CampusShell>
  );
}
