import { useEffect, useState } from "react";
import { ClipboardList, PieChart } from "lucide-react";
import { T, TopBar, Tag, ErrorNotice, LoadingState, MockDataNotice } from "../../lib/ui";
import { EventsApi, ApiError } from "../../lib/api";

export default function EventManagement({ go, event: eventProp }) {
  const [event, setEvent] = useState(eventProp || null);
  const [loading, setLoading] = useState(!!eventProp?.id);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!eventProp?.id) return;
    EventsApi.get(eventProp.id)
      .then(setEvent)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't load event."))
      .finally(() => setLoading(false));
  }, [eventProp?.id]);

  const setStatus = async (status) => {
    if (!event) return;
    setBusy(true);
    setError("");
    try {
      const updated = await EventsApi.updateStatus(event.id, status);
      setEvent(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't update the event's status.");
    } finally {
      setBusy(false);
    }
  };

  if (!eventProp?.id) {
    return (
      <div className="flex flex-col pb-16">
        <TopBar title="Event" onBack={() => go("eventsManagement")} />
        <div className="p-4"><EmptyNotice /></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-16">
      <TopBar title={event?.title || "Event"} onBack={() => go("eventsManagement")} />
      {loading && <LoadingState label="Loading event…" />}
      {event && (
        <div className="px-4 pt-6 flex flex-col gap-6">
          <div>
            <Tag bg="#d5e3fc" color={T.primary}>{event.status}</Tag>
            <div className="font-['Hanken_Grotesk'] font-bold text-[24px] mt-2" style={{ color: T.ink }}>{event.title}</div>
            <div className="font-['Inter'] text-[14px]" style={{ color: T.muted }}>{event.eventDate} • {event.venue}</div>
            <div className="flex gap-2 mt-3">
              {event.status === "PENDING" && (
                <div className="flex-1 py-2.5 px-3 rounded-lg font-['Inter'] text-[13px]" style={{ background: "#fff3e0", color: "#825100" }}>
                  Awaiting Campus Admin approval — you can't self-publish a pending event.
                </div>
              )}
              {event.status === "PUBLISHED" && (
                <button disabled={busy} onClick={() => setStatus("CANCELLED")} className="flex-1 py-2.5 rounded-lg font-['Inter'] text-[14.5px] border-none cursor-pointer disabled:opacity-50" style={{ background: "#ffdad6", color: "#ba1a1a" }}>{busy ? "Cancelling…" : "Cancel event"}</button>
              )}
            </div>
            <div className="font-['Inter'] text-[11.5px] mt-2" style={{ color: T.faint }}>Only Campus Admins can approve/reject a pending event (see the Event Approval Queue). Club admins may cancel their own already-published events here.</div>
          </div>

          {error && <ErrorNotice text={error} />}

          <div className="flex gap-5 font-['Hanken_Grotesk'] text-[15px]" style={{ borderBottom: "1px solid #c7c4d7" }}>
            <span className="pb-2" style={{ color: T.primary, borderBottom: `2px solid ${T.primary}` }}>Overview</span>
            <span onClick={() => go("registrations")} className="pb-2 cursor-pointer" style={{ color: T.muted }}>Registrations</span>
            <span onClick={() => go("volunteersOverview")} className="pb-2 cursor-pointer" style={{ color: T.muted }}>Volunteers</span>
            <span onClick={() => go("announcements")} className="pb-2 cursor-pointer" style={{ color: T.muted }}>Announcements</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-5 flex flex-col items-center gap-1" style={{ border: "1px solid rgba(199,196,215,0.3)" }}>
              <ClipboardList size={22} color={T.primary} />
              <div className="font-['Hanken_Grotesk'] font-extrabold text-[30px]" style={{ color: T.ink }}>{event.registeredCount}</div>
              <div className="font-['Inter'] font-bold text-[11px] tracking-wide" style={{ color: T.muted }}>Registrations</div>
            </div>
            <div className="bg-white rounded-xl p-5 flex flex-col items-center gap-1" style={{ border: "1px solid rgba(199,196,215,0.3)" }}>
              <PieChart size={22} color={T.primary} />
              <div className="font-['Hanken_Grotesk'] font-extrabold text-[30px]" style={{ color: T.ink }}>{event.maxRegistrations || "∞"}</div>
              <div className="font-['Inter'] font-bold text-[11px] tracking-wide" style={{ color: T.muted }}>Capacity</div>
            </div>
          </div>

          <div className="font-['Inter'] text-[14.5px] leading-relaxed" style={{ color: T.muted, whiteSpace: "pre-wrap" }}>{event.description}</div>

          <MockDataNotice text="Attendance charts and QR check-in aren't implemented on the backend — there's no attendance-tracking entity yet." />
        </div>
      )}
    </div>
  );
}

function EmptyNotice() {
  return <div className="font-['Inter'] text-[13.5px]" style={{ color: "#767586" }}>Open an event from the list to manage it.</div>;
}
