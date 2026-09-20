import { Shield, Bell, Users2, Bot, ChevronRight } from "lucide-react";
import { T, MockDataNotice, Card } from "../../lib/ui";
import CampusShell from "./Shell";

const SECTIONS = [
  { icon: Shield, title: "Moderation policy", desc: "AI sensitivity, auto-remove thresholds, escalation rules" },
  { icon: Bot, title: "AI moderation model", desc: "Gemini / Perspective API configuration" },
  { icon: Users2, title: "Staff & permissions", desc: "Manage campus admin and club officer access" },
  { icon: Bell, title: "Notification routing", desc: "Which alerts go to which staff channels" },
];

export default function CampusSettings({ go }) {
  return (
    <CampusShell go={go} active="campusSettings" title="Campus Settings" subtitle="Platform-wide configuration for Clubverse.">
      <MockDataNotice text="No platform-settings endpoint exists on the backend — this screen is demo data." />
      <div className="flex flex-col gap-4 max-w-[640px]">
        {SECTIONS.map(s => (
          <Card key={s.title} onClick={() => {}}>
            <div className="flex items-center justify-between">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: T.primaryTint }}><s.icon size={17} color={T.primary} /></div>
                <div>
                  <div className="font-['Hanken_Grotesk'] font-semibold text-[16px]" style={{ color: T.ink }}>{s.title}</div>
                  <div className="font-['Inter'] text-[13px]" style={{ color: T.muted }}>{s.desc}</div>
                </div>
              </div>
              <ChevronRight size={16} color={T.faint} />
            </div>
          </Card>
        ))}
      </div>
    </CampusShell>
  );
}
