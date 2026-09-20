import { AlertTriangle, Check, Trash2, UserX, Clock } from "lucide-react";
import { T, MockDataNotice, Card, Tag } from "../../lib/ui";
import CampusShell from "./Shell";

export default function ModerationReview({ go, item }) {
  const q = item || { type: "Post", community: "Confessions", reason: "Possible harassment", severity: "High" };
  return (
    <CampusShell go={go} active="moderationQueue" title="Review Content" subtitle={`${q.type} in ${q.community}`}>
      <MockDataNotice text="No content-moderation entity exists on the backend — this review screen is demo data." />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col gap-6">
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Tag bg="rgba(255,218,214,0.4)" color="#ba1a1a">{q.severity} severity</Tag>
              <span className="font-['Inter'] text-[12.5px]" style={{ color: T.muted }}>Flagged by: AI Moderation (Perspective API)</span>
            </div>
            <div className="font-['Inter'] text-[15px] leading-relaxed p-4 rounded-lg" style={{ background: T.page, color: T.ink }}>
              "Genuinely can't believe people still act like this. If you know who I'm talking about, you know exactly what you did and this campus deserves better."
            </div>
            <div className="flex gap-4 mt-3 font-['Inter'] text-[12.5px]" style={{ color: T.muted }}>
              <span>Posted anonymously · CS201 Batch</span>
              <span className="flex items-center gap-1"><Clock size={12} /> 5m ago</span>
            </div>
          </Card>
          <Card>
            <div className="font-['Hanken_Grotesk'] font-semibold text-[16px] mb-3" style={{ color: T.ink }}>AI moderation signals</div>
            <div className="flex flex-col gap-2 font-['Inter'] text-[13.5px]" style={{ color: T.muted }}>
              <div className="flex justify-between"><span>Toxicity score</span><span style={{ color: "#ba1a1a" }} className="font-semibold">0.78</span></div>
              <div className="flex justify-between"><span>Targeted harassment</span><span style={{ color: "#ba1a1a" }} className="font-semibold">Likely</span></div>
              <div className="flex justify-between"><span>Identifiable individual</span><span className="font-semibold">Possible</span></div>
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <div className="font-['Hanken_Grotesk'] font-semibold text-[16px] mb-3" style={{ color: T.ink }}>Take action</div>
            <div className="flex flex-col gap-2">
              <button onClick={() => go("moderationQueue")} className="w-full py-2.5 rounded-lg text-white font-['Inter'] font-semibold text-[13.5px] flex items-center justify-center gap-2 border-none cursor-pointer" style={{ background: T.primary }}><Check size={14} /> Approve (keep visible)</button>
              <button onClick={() => go("moderationQueue")} className="w-full py-2.5 rounded-lg font-['Inter'] font-semibold text-[13.5px] flex items-center justify-center gap-2 border cursor-pointer" style={{ borderColor: "#ba1a1a", color: "#ba1a1a", background: "white" }}><Trash2 size={14} /> Remove post</button>
              <button className="w-full py-2.5 rounded-lg font-['Inter'] font-semibold text-[13.5px] flex items-center justify-center gap-2 border cursor-pointer" style={{ borderColor: "#c7c4d7", color: T.ink, background: "white" }}><UserX size={14} /> Flag account for review</button>
            </div>
          </Card>
        </div>
      </div>
    </CampusShell>
  );
}
