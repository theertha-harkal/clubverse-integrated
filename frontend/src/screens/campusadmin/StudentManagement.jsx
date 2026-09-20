import { Search, MoreVertical } from "lucide-react";
import { T, MockDataNotice, Card, Pill } from "../../lib/ui";
import CampusShell from "./Shell";

const STUDENTS = [
  { name: "Alex Mercer", id: "2024BCS0142", dept: "Computer Science", status: "Active", clubs: 3 },
  { name: "Sarah Chen", id: "2024BCD0087", dept: "AI & DS", status: "Active", clubs: 2 },
  { name: "anon_wolf_22", id: "2023BCS0311", dept: "Electronics", status: "Flagged", clubs: 1, statusColor: "#ba1a1a", statusBg: "rgba(255,218,214,0.4)" },
  { name: "Jordan Smith", id: "2024BCS0299", dept: "Mechanical", status: "Active", clubs: 4 },
];

export default function StudentManagement({ go }) {
  return (
    <CampusShell go={go} active="studentManagement" title="Student Management" subtitle="4,812 verified students across campus.">
      <MockDataNotice text="No admin user-directory endpoint exists on the backend — this roster is demo data." />
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-[360px]">
          <Search size={16} color={T.faint} className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input placeholder="Search by name or student ID..." className="w-full rounded-lg border pl-9 pr-3 py-2.5 font-['Inter'] text-[14px] outline-none" style={{ borderColor: "#c7c4d7" }} />
        </div>
        <Pill active>All</Pill>
        <Pill>Flagged</Pill>
        <Pill>Suspended</Pill>
      </div>
      <Card className="!p-0 overflow-hidden">
        {STUDENTS.map((s, i) => (
          <div key={s.id} className="flex items-center justify-between px-6 py-4" style={{ borderBottom: i < STUDENTS.length - 1 ? "1px solid #e5e3ef" : "none" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full" style={{ background: T.primaryTint2 }} />
              <div>
                <div className="font-['Hanken_Grotesk'] font-semibold text-[15px]" style={{ color: T.ink }}>{s.name}</div>
                <div className="font-['Inter'] text-[12.5px]" style={{ color: T.muted }}>{s.id} · {s.dept} · {s.clubs} clubs joined</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="rounded-full px-3 py-1 font-['Inter'] text-[12px]" style={{ background: s.statusBg || "rgba(108,248,187,0.25)", color: s.statusColor || "#00714d" }}>{s.status}</span>
              <MoreVertical size={15} color={T.faint} />
            </div>
          </div>
        ))}
      </Card>
    </CampusShell>
  );
}
