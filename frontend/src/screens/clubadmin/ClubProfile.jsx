import { Camera, Pencil, GraduationCap, Users2, Mail, Copy, Home, Calendar, MessageCircle, User } from "lucide-react";
import { T, TopBar, BottomNav } from "../../lib/ui";

export default function ClubProfile({ go }) {
  return (
    <div className="flex flex-col pb-24">
      <div className="px-4 pt-3"><MockDataNotice text="Club profile editing isn't wired to a backend — there's no club/organization entity yet." /></div>
      <TopBar title="Club Details" onBack={() => go("dashboard")} />
      <div className="px-4 pt-6 flex flex-col gap-6">
        <div className="relative bg-white rounded-3xl p-5 overflow-hidden" style={{ boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" }}>
          <div className="absolute w-64 h-64 rounded-full -right-20 -top-20" style={{ background: "rgba(70,72,212,0.1)", filter: "blur(32px)" }} />
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center" style={{ background: T.sky, borderColor: T.page }}><Camera size={30} color={T.primary} /></div>
            <div className="absolute bottom-0 left-16 w-7 h-7 rounded-full border flex items-center justify-center" style={{ background: T.mint, borderColor: T.page }}><Pencil size={12} color={T.ink} /></div>
          </div>
          <div className="mt-4">
            <span className="rounded-full px-3 py-1 font-['Inter'] font-bold text-[11px] tracking-wide" style={{ background: "rgba(255,185,95,0.2)", color: "#a36700" }}>Creative Arts</span>
            <div className="font-['Hanken_Grotesk'] font-bold text-[26px] mt-2" style={{ color: T.ink }}>Photography Club</div>
            <div className="font-['Inter'] text-[14px] mt-1" style={{ color: T.muted }}>Capturing campus life through the lens.</div>
          </div>
          <button className="w-full mt-4 rounded-lg py-3 flex items-center justify-center gap-2 text-white font-['Inter'] text-[15px] border-none cursor-pointer" style={{ background: T.primary }}><Pencil size={14} /> Edit Club Profile</button>
        </div>

        <div className="relative bg-white rounded-3xl p-5 flex flex-col gap-4" style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
          <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full" style={{ background: T.mint }} />
          <div className="flex items-center gap-2"><GraduationCap size={19} color={T.ink} /><span className="font-['Hanken_Grotesk'] font-semibold text-[18px]" style={{ color: T.ink }}>Faculty Coordinator</span></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full" style={{ background: "#dce9ff" }} />
            <div>
              <div className="font-['Hanken_Grotesk'] font-semibold text-[15px]" style={{ color: T.ink }}>Dr. Elena Vance</div>
              <div className="font-['Inter'] text-[13px]" style={{ color: T.muted }}>Professor of Visual Arts</div>
            </div>
          </div>
        </div>

        <div className="relative bg-white rounded-3xl p-5 flex flex-col gap-5" style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
          <div className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full" style={{ background: "#825100" }} />
          <div className="flex items-center gap-2"><Users2 size={17} color={T.ink} /><span className="font-['Hanken_Grotesk'] font-semibold text-[18px]" style={{ color: T.ink }}>Student Coordinators</span></div>
          {[{ n: "Sarah Jenkins", r: "President" }, { n: "Mark Chen", r: "Events Lead" }].map(p => (
            <div key={p.n} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full" style={{ background: "#dce9ff" }} />
              <div>
                <div className="font-['Hanken_Grotesk'] font-semibold text-[15px]" style={{ color: T.ink }}>{p.n}</div>
                <div className="font-['Inter'] text-[13px]" style={{ color: T.muted }}>{p.r}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-5 flex flex-col gap-4" style={{ boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center gap-2"><Mail size={17} color={T.ink} /><span className="font-['Hanken_Grotesk'] font-semibold text-[18px]" style={{ color: T.ink }}>Contact Information</span></div>
          <div className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ background: T.primaryTint, border: `1px solid ${T.sky}` }}>
            <Mail size={16} color={T.primary} /><span className="font-['Inter'] text-[14px]" style={{ color: T.primary }}>photography@university.edu</span>
          </div>
          <button className="w-full rounded-lg py-3 flex items-center justify-center gap-2 font-['Inter'] text-[14.5px] border cursor-pointer" style={{ borderColor: T.primary, color: T.primary, background: "white" }}><Copy size={14} /> Copy Email</button>
        </div>
      </div>

      <div className="fixed bottom-0 w-[390px] left-1/2 -translate-x-1/2">
        <BottomNav active="clubProfile" go={go} items={[
          { key: "dashboard", icon: Home, label: "Home" },
          { key: "clubProfile", icon: User, label: "Club" },
          { key: "eventsManagement", icon: Calendar, label: "Events" },
          { key: "notifications", icon: MessageCircle, label: "Messages" },
          { key: "settings", icon: User, label: "Profile" },
        ]} />
      </div>
    </div>
  );
}
