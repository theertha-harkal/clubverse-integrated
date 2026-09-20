import { TrendingUp, Users2, ShieldCheck, Calendar1, Award } from "lucide-react";
import { T, MockDataNotice, Card, StatCard } from "../../lib/ui";
import CampusShell from "./Shell";

const CLUBS = [{ n: "Photography Club", v: 92 }, { n: "Tech Society", v: 87 }, { n: "Debate Society", v: 74 }, { n: "AI/ML Club", v: 68 }];

export default function CampusAnalytics({ go }) {
  return (
    <CampusShell go={go} active="campusAnalytics" title="Campus Analytics" subtitle="Platform-wide engagement and moderation health.">
      <MockDataNotice text="No analytics endpoint exists on the backend — these charts are demo data." />
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Daily Active Students" value="1,940" />
        <StatCard label="Posts this week" value="3,214" bg="rgba(96,99,238,0.1)" />
        <StatCard label="Moderation accuracy" value="96%" bg="rgba(108,248,187,0.25)" color="#00714d" />
        <StatCard label="Avg. resolution time" value="4.2h" bg="rgba(255,185,95,0.2)" color="#825100" />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <div className="flex items-center gap-2 mb-4"><TrendingUp size={16} color={T.primary} /><span className="font-['Hanken_Grotesk'] font-semibold text-[17px]" style={{ color: T.ink }}>Platform growth, last 6 months</span></div>
            <div className="flex items-end justify-between h-40 gap-3">
              {[30, 45, 55, 70, 88, 100].map((v, i) => (
                <div key={i} className="flex-1 rounded-t" style={{ height: `${v * 1.6}px`, background: T.primary, opacity: 0.4 + (i / 6) * 0.6 }} />
              ))}
            </div>
          </Card>
        </div>
        <Card>
          <div className="font-['Hanken_Grotesk'] font-semibold text-[17px] mb-4" style={{ color: T.ink }}>Most active clubs</div>
          <div className="flex flex-col gap-3">
            {CLUBS.map(c => (
              <div key={c.n}>
                <div className="flex justify-between font-['Inter'] text-[13px] mb-1" style={{ color: T.ink }}><span>{c.n}</span><span style={{ color: T.primary }}>{c.v}%</span></div>
                <div className="w-full h-2 rounded-full" style={{ background: T.page }}><div className="h-2 rounded-full" style={{ width: `${c.v}%`, background: T.primary }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </CampusShell>
  );
}
