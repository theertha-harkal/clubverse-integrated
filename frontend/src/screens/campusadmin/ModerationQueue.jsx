import { AlertTriangle, MessageSquare, Flag } from "lucide-react";
import { T, MockDataNotice, Card, Pill, Tag } from "../../lib/ui";
import CampusShell from "./Shell";

const QUEUE = [
  { type: "Post", community: "Confessions", reason: "Possible harassment", severity: "High", excerpt: "Anonymous post flagged by AI moderation for aggressive language toward a named individual.", time: "5m ago" },
  { type: "Comment", community: "Dev Hub", reason: "Spam link", severity: "Low", excerpt: "Comment contains a repeated external link flagged by the spam filter.", time: "22m ago" },
  { type: "Post", community: "CS201 Batch", reason: "Reported by 3 users", severity: "Medium", excerpt: "Multiple students reported this post as off-topic and disruptive.", time: "1h ago" },
];

const SEV_COLOR = { High: "#ba1a1a", Medium: "#825100", Low: T.muted };
const SEV_BG = { High: "rgba(255,218,214,0.4)", Medium: "rgba(255,185,95,0.2)", Low: T.page };

export default function ModerationQueue({ go, openReview }) {
  return (
    <CampusShell go={go} active="moderationQueue" title="Moderation Queue" subtitle="AI-flagged and user-reported content awaiting review.">
      <MockDataNotice text="No content-moderation entity exists on the backend (posts have no moderation-status field) — this queue is demo data." />
      <div className="flex gap-2 mb-6">
        {["All (7)", "High severity", "Posts", "Comments"].map((f, i) => <Pill key={f} active={i === 0}>{f}</Pill>)}
      </div>
      <div className="flex flex-col gap-4">
        {QUEUE.map((q, i) => (
          <Card key={i} onClick={() => openReview && openReview(q)}>
            <div className="flex items-start justify-between">
              <div className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: SEV_BG[q.severity] }}>
                  {q.type === "Post" ? <MessageSquare size={15} color={SEV_COLOR[q.severity]} /> : <Flag size={15} color={SEV_COLOR[q.severity]} />}
                </div>
                <div>
                  <div className="font-['Hanken_Grotesk'] font-semibold text-[15px]" style={{ color: T.ink }}>{q.type} in {q.community}</div>
                  <div className="font-['Inter'] text-[13px] mt-1" style={{ color: T.muted }}>{q.excerpt}</div>
                  <div className="font-['Inter'] text-[11.5px] mt-1" style={{ color: T.faint }}>Reason: {q.reason} · {q.time}</div>
                </div>
              </div>
              <Tag bg={SEV_BG[q.severity]} color={SEV_COLOR[q.severity]}>{q.severity}</Tag>
            </div>
          </Card>
        ))}
      </div>
    </CampusShell>
  );
}
