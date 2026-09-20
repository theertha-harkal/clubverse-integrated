import { useEffect, useState } from "react";
import { Calendar, MapPin, Users2, Award, Share2, CheckCircle2 } from "lucide-react";
import { T, TopBar, Tag, PrimaryButton, LoadingState, ErrorNotice } from "../../lib/ui";
import { EventsApi, ApiError } from "../../lib/api";

function fmtDate(eventDate) {
  if (!eventDate) return "TBD";
  return new Date(`${eventDate}T00:00:00`).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

export default function EventDetail({ go, event: eventProp }) {
  const [event, setEvent] = useState(eventProp || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  const eventId = eventProp?.id;

  useEffect(() => {
    if (!eventId) { setLoading(false); setError("No event selected."); return; }
    let cancelled = false;
    Promise.all([EventsApi.get(eventId), EventsApi.myRegistrations().catch(() => [])])
      .then(([ev, mine]) => {
        if (cancelled) return;
        setEvent(ev);
        setRegistered(mine.some((r) => r.eventId === eventId));
      })
      .catch((err) => { if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load this event."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [eventId]);

  const register = async () => {
    if (!eventId) return;
    setRegistering(true);
    setError("");
    try {
      await EventsApi.register(eventId);
      setRegistered(true);
      const fresh = await EventsApi.get(eventId);
      setEvent(fresh);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't register for this event.");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-32">
      <TopBar title="Event" onBack={() => go("events")} right={<Share2 size={16} color={T.ink} />} />

      {loading && <LoadingState label="Loading event…" />}
      {error && !event && <div className="px-4"><ErrorNotice text={error} /></div>}

      {event && (
        <>
          <div className="w-full h-[180px]" style={{ background: event.posterUrl ? undefined : T.sky, backgroundImage: event.posterUrl ? `url(${event.posterUrl})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="flex flex-col gap-6 px-4 pt-6">
            <div>
              <Tag bg="#d5e3fc" color={T.primary}>{event.status}</Tag>
              <div className="font-['Hanken_Grotesk'] font-bold text-[26px] mt-2" style={{ color: T.ink }}>{event.title}</div>
              <div className="font-['Inter'] text-[13.5px] mt-1" style={{ color: T.muted }}>Organized by {event.organizerName}</div>
            </div>

            <div className="flex flex-col gap-3 bg-white rounded-2xl p-4" style={{ border: "1px solid rgba(199,196,215,0.3)" }}>
              <span className="flex items-center gap-2 font-['Inter'] text-[14px]" style={{ color: T.ink }}><Calendar size={15} color={T.primary} /> {fmtDate(event.eventDate)} • {event.startTime}{event.endTime ? `–${event.endTime}` : ""}</span>
              <span className="flex items-center gap-2 font-['Inter'] text-[14px]" style={{ color: T.ink }}><MapPin size={15} color={T.primary} /> {event.venue}</span>
              <span className="flex items-center gap-2 font-['Inter'] text-[14px]" style={{ color: T.ink }}><Users2 size={15} color={T.primary} /> {event.registeredCount}{event.maxRegistrations ? `/${event.maxRegistrations}` : ""} registered</span>
              {event.rewardsEnabled && <span className="flex items-center gap-2 font-['Inter'] text-[14px]" style={{ color: T.ink }}><Award size={15} color="#ffb95f" /> {event.rewardXp} XP for attending</span>}
            </div>

            <div>
              <div className="font-['Hanken_Grotesk'] font-semibold text-[17px] mb-2" style={{ color: T.ink }}>About this event</div>
              <div className="font-['Inter'] text-[14.5px] leading-relaxed" style={{ color: T.muted, whiteSpace: "pre-wrap" }}>{event.description}</div>
            </div>

            {event.eligibility && (
              <div className="font-['Inter'] text-[13px]" style={{ color: T.muted }}><span className="font-semibold" style={{ color: T.ink }}>Eligibility:</span> {event.eligibility}</div>
            )}

            {error && <ErrorNotice text={error} />}
          </div>

          <div className="fixed bottom-0 w-[390px] px-4 py-4" style={{ background: "rgba(248,249,255,0.95)", borderTop: "1px solid rgba(199,196,215,0.3)" }}>
            {registered ? (
              <div className="flex items-center justify-center gap-2 py-3 rounded-full font-['Hanken_Grotesk'] font-semibold text-[16px]" style={{ background: "#dcf5e6", color: "#0f9d58" }}>
                <CheckCircle2 size={16} /> You're registered
              </div>
            ) : (
              <PrimaryButton onClick={register} disabled={registering || event.status !== "PUBLISHED"}>
                {registering ? "Registering…" : event.status !== "PUBLISHED" ? `Registration unavailable (${event.status})` : "Register for this event"}
              </PrimaryButton>
            )}
          </div>
        </>
      )}
    </div>
  );
}
