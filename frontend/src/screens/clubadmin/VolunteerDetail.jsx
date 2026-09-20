import { useState } from "react";
import { Mail, Calendar, Award, Check, X } from "lucide-react";
import { T, TopBar, Tag, ErrorNotice } from "../../lib/ui";
import { VolunteerApi, ApiError } from "../../lib/api";

const STATUS_STYLE = {
  PENDING: { bg: "rgba(163,103,0,0.15)", color: "#825100" },
  ACCEPTED: { bg: "rgba(108,248,187,0.3)", color: "#00714d" },
  REJECTED: { bg: "rgba(255,218,214,0.4)", color: "#ba1a1a" },
};

export default function VolunteerDetail({ go, volunteer }) {
  const [v, setV] = useState(volunteer);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!v) {
    return (
      <div className="flex flex-col pb-10">
        <TopBar title="Volunteer" onBack={() => go("volunteersOverview")} />
        <div className="px-4 pt-6 font-['Inter'] text-[13.5px]" style={{ color: T.muted }}>Open an application from the list to review it.</div>
      </div>
    );
  }

  const decide = async (status) => {
    setBusy(true);
    setError("");
    try {
      const updated = await VolunteerApi.updateApplicationStatus(v.id, status);
      setV({ ...v, ...updated });
      go("volunteersOverview");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't update this application.");
    } finally {
      setBusy(false);
    }
  };

  const s = STATUS_STYLE[v.status] || STATUS_STYLE.PENDING;

  return (
    <div className="flex flex-col pb-10">
      <TopBar title="Volunteer" onBack={() => go("volunteersOverview")} />
      <div className="px-4 pt-6 flex flex-col gap-6">
        <div className="bg-white rounded-3xl p-6 flex flex-col items-center gap-2" style={{ border: "1px solid rgba(199,196,215,0.3)", boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center font-['Hanken_Grotesk'] font-bold text-[24px]" style={{ background: T.primaryTint2, color: T.primary }}>{v.userName?.[0]?.toUpperCase()}</div>
          <div className="font-['Hanken_Grotesk'] font-bold text-[21px]" style={{ color: T.ink }}>{v.userName}</div>
          <div className="font-['Inter'] text-[13.5px]" style={{ color: T.muted }}>{v.role}</div>
          <Tag bg={s.bg} color={s.color}>{v.status}</Tag>
        </div>

        <div className="bg-white rounded-3xl p-5 flex flex-col gap-4" style={{ border: "1px solid rgba(199,196,215,0.3)", boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center gap-3"><Calendar size={16} color={T.primary} /><span className="font-['Inter'] text-[14px]" style={{ color: T.ink }}>Applying for: {v.opportunity?.eventTitle || `Opportunity #${v.opportunityId}`}</span></div>
          <div className="flex items-center gap-3"><Mail size={16} color={T.primary} /><span className="font-['Inter'] text-[14px]" style={{ color: T.ink }}>{v.userEmail}</span></div>
          {v.opportunity?.rewardXp != null && <div className="flex items-center gap-3"><Award size={16} color="#825100" /><span className="font-['Inter'] font-semibold text-[14px]" style={{ color: "#825100" }}>{v.opportunity.rewardXp} XP reward on completion</span></div>}
        </div>

        {v.applicationMessage && (
          <div className="bg-white rounded-3xl p-5" style={{ border: "1px solid rgba(199,196,215,0.3)" }}>
            <div className="font-['Hanken_Grotesk'] font-semibold text-[16px] mb-2" style={{ color: T.ink }}>Why I'd like to volunteer</div>
            <div className="font-['Inter'] text-[13.5px] leading-relaxed" style={{ color: T.muted }}>{v.applicationMessage}</div>
          </div>
        )}

        {error && <ErrorNotice text={error} />}

        {v.status === "PENDING" && (
          <div className="flex gap-3">
            <button disabled={busy} onClick={() => decide("REJECTED")} className="flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-['Inter'] font-semibold text-[15px] border cursor-pointer disabled:opacity-60" style={{ borderColor: "#ba1a1a", color: "#ba1a1a", background: "white" }}><X size={15} /> Reject</button>
            <button disabled={busy} onClick={() => decide("ACCEPTED")} className="flex-1 py-3 rounded-lg flex items-center justify-center gap-2 font-['Inter'] font-semibold text-[15px] text-white border-none cursor-pointer disabled:opacity-60" style={{ background: T.primary }}><Check size={15} /> Approve</button>
          </div>
        )}
      </div>
    </div>
  );
}
