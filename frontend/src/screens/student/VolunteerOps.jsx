import { useEffect, useState } from "react";
import { Award, Info, CalendarClock, ArrowRight, Home, Users, Calendar, MessageCircle, User } from "lucide-react";
import { T, Pill, BottomNav, LoadingState, ErrorNotice, EmptyState } from "../../lib/ui";
import { VolunteerApi, ApiError } from "../../lib/api";

export default function VolunteerOps({ go }) {
  const [opportunities, setOpportunities] = useState([]);
  const [applied, setApplied] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applyingId, setApplyingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([VolunteerApi.opportunities(), VolunteerApi.myApplications().catch(() => [])])
      .then(([opps, mine]) => {
        if (cancelled) return;
        setOpportunities(opps.filter((o) => o.active));
        setApplied(new Set(mine.map((a) => a.opportunityId)));
      })
      .catch((err) => { if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load volunteer opportunities."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const apply = async (opportunityId) => {
    setApplyingId(opportunityId);
    try {
      await VolunteerApi.apply(opportunityId, { applicationMessage: "I'd love to help out!" });
      setApplied((prev) => new Set(prev).add(opportunityId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't submit your application.");
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 pt-8 pb-24">
      <div className="px-4 text-center">
        <div className="font-['Hanken_Grotesk'] font-extrabold text-[32px] leading-tight" style={{ color: T.ink }}>Volunteer Opportunities</div>
        <div className="font-['Inter'] text-[14px] mt-2" style={{ color: T.muted }}>Earn XP, build your resume, and help make campus events incredible. Apply for open roles below.</div>
      </div>

      <div className="flex flex-col gap-4 px-4">
        {error && <ErrorNotice text={error} />}
        {loading && <LoadingState label="Loading opportunities…" />}
        {!loading && !error && opportunities.length === 0 && <EmptyState text="No open volunteer roles right now." />}
        {opportunities.map(r => {
          const isApplied = applied.has(r.id);
          const full = r.filledSlots >= r.totalSlots;
          return (
            <div key={r.id} className="bg-white rounded-3xl p-5 flex flex-col gap-3" style={{ border: "1px solid #c7c4d7", boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full px-2 py-1 font-['Inter'] font-bold text-[11px]" style={{ background: "rgba(96,99,238,0.1)", color: T.primary }}>{r.team || "General"}</span>
                  <div className="font-['Hanken_Grotesk'] font-semibold text-[18px] mt-2" style={{ color: T.ink }}>{r.role}</div>
                  <div className="font-['Inter'] text-[13px]" style={{ color: T.muted }}>{r.eventTitle}</div>
                </div>
                {r.rewardXp != null && <span className="flex items-center gap-1 font-['Inter'] font-bold text-[15px]" style={{ color: "#ffb95f" }}><Award size={14} /> {r.rewardXp} XP</span>}
              </div>
              <div className="flex flex-col gap-1.5">
                {r.requirements && <span className="flex items-center gap-2 font-['Inter'] text-[13px]" style={{ color: T.ink }}><Info size={13} color={T.muted} /> {r.requirements}</span>}
                {r.applicationDeadline && <span className="flex items-center gap-2 font-['Inter'] text-[13px]" style={{ color: T.ink }}><CalendarClock size={13} color={T.muted} /> Deadline: {r.applicationDeadline}</span>}
                <span className="font-['Inter'] text-[12px]" style={{ color: T.faint }}>{r.filledSlots}/{r.totalSlots} slots filled</span>
              </div>
              <button
                onClick={() => apply(r.id)}
                disabled={isApplied || full || applyingId === r.id}
                className="w-full py-3 rounded-lg font-['Hanken_Grotesk'] font-semibold text-[16px] flex items-center justify-center gap-2 border-none cursor-pointer disabled:opacity-60"
                style={{ background: isApplied ? "#dce9ff" : T.primary, color: isApplied ? T.primary : "white" }}>
                {isApplied ? "Applied" : full ? "Full" : applyingId === r.id ? "Applying…" : <>Apply <ArrowRight size={13} /></>}
              </button>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 w-[390px]">
        <BottomNav active="events" go={go} items={[
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
