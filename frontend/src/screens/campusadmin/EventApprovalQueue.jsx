import { useEffect, useState } from "react";
import { Calendar, MapPin, Check, X } from "lucide-react";
import { T, Card, Tag, LoadingState, ErrorNotice, EmptyState } from "../../lib/ui";
import { EventsApi, ApiError } from "../../lib/api";
import CampusShell from "./Shell";

export default function EventApprovalQueue({ go }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    EventsApi.list()
      .then((all) => setEvents(all.filter((e) => e.status === "PENDING")))
      .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't load pending events."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const decide = async (id, status) => {
    setBusyId(id);
    setError("");
    try {
      await EventsApi.updateStatus(id, status);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't update this event.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <CampusShell go={go} active="eventApprovalQueue" title="Event Approval Queue" subtitle="Club events awaiting campus-level sign-off.">
      {error && <ErrorNotice text={error} />}
      {loading && <LoadingState label="Loading pending events…" />}
      {!loading && events.length === 0 && <EmptyState text="No events awaiting approval." />}
      <div className="flex flex-col gap-4">
        {events.map(e => (
          <Card key={e.id}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-['Hanken_Grotesk'] font-semibold text-[17px]" style={{ color: T.ink }}>{e.title}</div>
                <div className="font-['Inter'] text-[13px] mt-0.5" style={{ color: T.muted }}>{e.organizerName}</div>
                <div className="flex gap-4 mt-3 font-['Inter'] text-[13px]" style={{ color: T.ink }}>
                  <span className="flex items-center gap-1"><Calendar size={13} color={T.muted} />{e.eventDate || "TBD"} {e.startTime ? `· ${e.startTime}` : ""}</span>
                  <span className="flex items-center gap-1"><MapPin size={13} color={T.muted} />{e.venue || "Not set"}</span>
                </div>
                <Tag bg="rgba(255,218,214,0.4)" color="#ba1a1a" className="mt-3 inline-block">Awaiting approval</Tag>
              </div>
              <div className="flex gap-2 shrink-0">
                <button disabled={busyId === e.id} onClick={() => decide(e.id, "REJECTED")} className="px-4 py-2 rounded-lg font-['Inter'] font-semibold text-[13px] flex items-center gap-1 border cursor-pointer disabled:opacity-60" style={{ borderColor: "#ba1a1a", color: "#ba1a1a", background: "white" }}><X size={13} /> Deny</button>
                <button disabled={busyId === e.id} onClick={() => decide(e.id, "PUBLISHED")} className="px-4 py-2 rounded-lg font-['Inter'] font-semibold text-[13px] flex items-center gap-1 text-white border-none cursor-pointer disabled:opacity-60" style={{ background: T.primary }}><Check size={13} /> Approve</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </CampusShell>
  );
}
