import { useEffect, useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { T, TopBar, LoadingState, ErrorNotice, EmptyState } from "../../lib/ui";
import { EventsApi, ApiError } from "../../lib/api";

export default function Registrations({ go, event }) {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(!!event?.id);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!event?.id) { setLoading(false); return; }
    EventsApi.registrations(event.id)
      .then(setRegs)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't load registrations."))
      .finally(() => setLoading(false));
  }, [event?.id]);

  const visible = useMemo(() => {
    if (!query.trim()) return regs;
    const q = query.trim().toLowerCase();
    return regs.filter((r) => r.userName?.toLowerCase().includes(q) || r.userEmail?.toLowerCase().includes(q));
  }, [regs, query]);

  const exportCsv = () => {
    const header = "Name,Email,Status,Registered At\n";
    const rows = regs.map((r) => `${r.userName},${r.userEmail},${r.status},${r.registeredAt}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event?.title || "event"}-registrations.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col pb-16">
      <TopBar title="Registrations" onBack={() => go("eventManagement")} />
      <div className="px-4 pt-4 flex flex-col gap-4">
        <div>
          <div className="font-['Inter'] text-[14px]" style={{ color: T.ink }}>{event?.title || "No event selected"}</div>
          <div className="font-['Inter'] text-[13px]" style={{ color: T.muted }}>Registration Management</div>
        </div>
        <button onClick={exportCsv} disabled={regs.length === 0} className="w-full py-3 rounded-lg flex items-center justify-center gap-2 font-['Inter'] text-[14.5px] border cursor-pointer disabled:opacity-50" style={{ borderColor: T.primary, color: T.primary, background: "#e6eeff" }}><Download size={15} /> Export CSV</button>

        <div className="bg-white rounded-2xl p-4 flex flex-col gap-3" style={{ border: "1px solid rgba(199,196,215,0.3)", boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
          <div className="relative">
            <Search size={16} color={T.faint} className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search students..." className="w-full rounded-lg pl-9 pr-3 py-3 font-['Inter'] text-[14px] outline-none" style={{ background: T.primaryTint }} />
          </div>
        </div>

        {error && <ErrorNotice text={error} />}
        {loading && <LoadingState label="Loading registrations…" />}

        <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(199,196,215,0.3)", boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" }}>
          {!loading && visible.length === 0 && <div className="p-4"><EmptyState text="No registrations yet." /></div>}
          {visible.map(r => (
            <div key={r.id} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(199,196,215,0.3)" }}>
              <div>
                <div className="font-['Hanken_Grotesk'] text-[15px]" style={{ color: T.ink }}>{r.userName}</div>
                <div className="font-['Inter'] text-[12px]" style={{ color: T.muted }}>{r.userEmail}</div>
              </div>
              <span className="rounded-full px-3 py-1.5 font-['Inter'] text-[12px] shrink-0" style={{ background: "rgba(108,248,187,0.3)", color: "#00714d" }}>{r.status}</span>
            </div>
          ))}
          {visible.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3" style={{ background: T.page }}>
              <span className="font-['Inter'] text-[13px]" style={{ color: T.muted }}>Showing {visible.length} of {regs.length} entries</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
