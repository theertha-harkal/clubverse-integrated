import { useEffect, useState } from "react";
import { Flag } from "lucide-react";
import { T, Card, Tag, Pill, LoadingState, ErrorNotice, EmptyState, MockDataNotice } from "../../lib/ui";
import { ReportsApi, ApiError } from "../../lib/api";
import CampusShell from "./Shell";

const STATUS_STYLE = {
  NEW: { bg: "rgba(255,218,214,0.4)", color: "#ba1a1a" },
  PENDING: { bg: "rgba(255,185,95,0.2)", color: "#825100" },
  RESOLVED: { bg: "rgba(108,248,187,0.25)", color: "#00714d" },
};

export default function ReportsManagement({ go }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    ReportsApi.list(filter === "All" ? {} : { status: filter })
      .then((data) => { if (!cancelled) setReports(data); })
      .catch((err) => { if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load reports."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [filter]);

  return (
    <CampusShell go={go} active="reportsManagement" title="Reports Management" subtitle="Content and account reports filed by students.">
      <MockDataNotice text="Report status can't be changed here yet — there's no PUT /api/reports/{id}/status endpoint on the backend. This view is read-only." />
      <div className="flex gap-2 my-4">
        {["All", "NEW", "PENDING", "RESOLVED"].map((f) => <Pill key={f} active={f === filter} onClick={() => setFilter(f)}>{f === "All" ? "All" : f[0] + f.slice(1).toLowerCase()}</Pill>)}
      </div>
      {error && <ErrorNotice text={error} />}
      {loading && <LoadingState label="Loading reports…" />}
      {!loading && !error && reports.length === 0 && <EmptyState text="No reports found." />}
      {reports.length > 0 && (
        <Card className="!p-0 overflow-hidden">
          {reports.map((r, i) => {
            const s = STATUS_STYLE[r.status] || STATUS_STYLE.NEW;
            const subject = r.reportType === "POST" ? `Post #${r.reportedPostId}` : r.reportType === "EVENT" ? `Event #${r.reportedEventId}` : `User #${r.reportedUserId}`;
            return (
              <div key={r.id} className="flex items-center justify-between px-6 py-4" style={{ borderBottom: i < reports.length - 1 ? "1px solid #e5e3ef" : "none" }}>
                <div className="flex items-center gap-3">
                  <Flag size={16} color={T.muted} />
                  <div>
                    <div className="font-['Hanken_Grotesk'] font-semibold text-[15px]" style={{ color: T.ink }}>{subject}</div>
                    <div className="font-['Inter'] text-[12.5px]" style={{ color: T.muted }}>{r.category} · {r.severity} severity · {new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <Tag bg={s.bg} color={s.color}>{r.status}</Tag>
              </div>
            );
          })}
        </Card>
      )}
    </CampusShell>
  );
}
