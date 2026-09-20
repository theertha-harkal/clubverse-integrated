import { ArrowLeft, Bell } from "lucide-react";

/* Design tokens pulled from the Figma file:
   primary indigo #4648d4 · primary tint #eff4ff / #e1e0ff
   mint #6cf8bb · peach #ffddb8 · sky #d5e3fc
   text dark #0d1c2e · text muted #464554 · text faint #767586
   page bg #f8f9ff · display font Hanken Grotesk · body font Inter */

export const T = {
  primary: "#4648d4",
  primaryTint: "#eff4ff",
  primaryTint2: "#e1e0ff",
  mint: "#6cf8bb",
  mintTint: "#e3fdf0",
  peach: "#ffddb8",
  peachTint: "#fff3e4",
  sky: "#d5e3fc",
  skyTint: "#eff5ff",
  ink: "#0d1c2e",
  muted: "#464554",
  faint: "#767586",
  border: "#e5e3ef",
  page: "#f8f9ff",
  danger: "#ef4444",
};

export function PhoneFrame({ children }) {
  return (
    <div className="w-[390px] h-[844px] bg-white rounded-[40px] border-[8px] border-black shadow-2xl overflow-hidden relative flex flex-col shrink-0">
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col" style={{ background: T.page }}>
        {children}
      </div>
    </div>
  );
}

export function DesktopFrame({ children }) {
  return (
    <div className="w-[1180px] h-[844px] bg-white rounded-2xl border border-gray-300 shadow-2xl overflow-hidden relative flex shrink-0">
      {children}
    </div>
  );
}

export function TopBar({ title, onBack, right, dark }) {
  return (
    <div className="flex items-center px-4 py-4 sticky top-0 z-10" style={{ background: dark ? T.ink : "white", borderBottom: `1px solid ${T.border}` }}>
      {onBack ? (
        <button onClick={onBack} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: dark ? "#1f2937" : T.primaryTint }}>
          <ArrowLeft size={16} color={dark ? "white" : T.primary} />
        </button>
      ) : <div className="w-8" />}
      <div className="flex-1 text-center font-['Hanken_Grotesk'] font-bold text-[15px]" style={{ color: dark ? "white" : T.ink }}>{title}</div>
      <div className="w-8 flex justify-end">{right}</div>
    </div>
  );
}

export function PrimaryButton({ children, onClick, full = true, className = "", disabled = false, type }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`font-['Hanken_Grotesk'] font-semibold text-white rounded-full py-3 px-5 text-[15px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${full ? "w-full" : ""} ${className}`} style={{ background: T.primary }}>
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, className = "" }) {
  return (
    <button onClick={onClick} className={`font-['Hanken_Grotesk'] font-semibold rounded-full py-3 px-5 text-[15px] cursor-pointer border ${className}`} style={{ borderColor: T.border, color: T.ink }}>
      {children}
    </button>
  );
}

export function Tag({ children, bg = T.primaryTint2, color = T.primary, className = "" }) {
  return (
    <span className={`font-['Inter'] font-semibold text-[10.5px] px-2 py-1 rounded-md ${className}`} style={{ background: bg, color }}>
      {children}
    </span>
  );
}

export function Card({ children, className = "", onClick }) {
  return (
    <div onClick={onClick} className={`bg-white rounded-2xl p-4 ${onClick ? "cursor-pointer" : ""} ${className}`} style={{ border: `1px solid ${T.border}`, boxShadow: "0px 4px 10px rgba(0,0,0,0.04)" }}>
      {children}
    </div>
  );
}

export function Pill({ children, active, onClick }) {
  return (
    <button onClick={onClick} className="px-3 py-1.5 rounded-full text-[12px] font-['Inter'] font-semibold whitespace-nowrap cursor-pointer border"
      style={{ background: active ? T.primaryTint2 : "white", borderColor: active ? T.primary : T.border, color: active ? T.primary : T.faint }}>
      {children}
    </button>
  );
}

export function StatCard({ label, value, bg = T.primaryTint, color = T.primary }) {
  return (
    <div className="rounded-2xl p-4 flex-1" style={{ background: bg }}>
      <div className="font-['Hanken_Grotesk'] font-extrabold text-[24px]" style={{ color }}>{value}</div>
      <div className="font-['Inter'] text-[11px] mt-1" style={{ color }}>{label}</div>
    </div>
  );
}

export function BottomNav({ items, active, go }) {
  return (
    <div className="flex border-t bg-white px-1 py-2 sticky bottom-0" style={{ borderColor: T.border }}>
      {items.map(({ key, icon: Icon, label }) => {
        const isActive = active === key;
        return (
          <button key={key} onClick={() => go(key)} className="flex-1 flex flex-col items-center gap-1 py-1 cursor-pointer bg-transparent border-none">
            <Icon size={19} color={isActive ? T.primary : "#B9B8C6"} strokeWidth={isActive ? 2.4 : 2} />
            <span className="text-[9.5px] font-['Inter']" style={{ color: isActive ? T.ink : "#B9B8C6", fontWeight: isActive ? 600 : 500 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function AdminSidebar({ items, active, go, title = "Clubverse Admin" }) {
  return (
    <div className="w-[220px] shrink-0 flex flex-col text-white" style={{ background: T.ink }}>
      <div className="px-5 py-6 font-['Hanken_Grotesk'] font-bold text-[16px] border-b border-white/10">{title}</div>
      <div className="flex-1 py-3">
        {items.map(({ key, icon: Icon, label }) => {
          const isActive = active === key;
          return (
            <button key={key} onClick={() => go(key)} className="w-full flex items-center gap-3 px-5 py-2.5 text-left cursor-pointer bg-transparent border-none"
              style={{ background: isActive ? "rgba(255,255,255,0.08)" : "transparent", borderLeft: isActive ? `3px solid ${T.mint}` : "3px solid transparent" }}>
              <Icon size={16} color={isActive ? T.mint : "#9CA3AF"} />
              <span className="text-[13px] font-['Inter']" style={{ color: isActive ? "white" : "#9CA3AF", fontWeight: isActive ? 600 : 400 }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Notice({ icon: Icon, text, bg = T.mintTint, color = "#0f9d58" }) {
  return (
    <div className="flex items-center gap-2 rounded-lg px-3 py-2.5" style={{ background: bg }}>
      {Icon && <Icon size={14} color={color} />}
      <span className="font-['Inter'] text-[12px]" style={{ color }}>{text}</span>
    </div>
  );
}

// --- Added while wiring the frontend up to the real backend ---

export function TextField({ label, ...inputProps }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="font-['Inter'] font-bold text-[11px] tracking-wide uppercase" style={{ color: T.muted }}>{label}</label>}
      <input
        {...inputProps}
        className={`w-full rounded-lg px-4 py-3 font-['Inter'] text-[15px] outline-none border ${inputProps.className || ""}`}
        style={{ borderColor: "#c7c4d7", background: T.primaryTint, color: T.ink, ...(inputProps.style || {}) }}
      />
    </div>
  );
}

export function TextAreaField({ label, ...inputProps }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="font-['Inter'] font-bold text-[11px] tracking-wide uppercase" style={{ color: T.muted }}>{label}</label>}
      <textarea
        {...inputProps}
        className={`w-full rounded-lg px-4 py-3 font-['Inter'] text-[15px] outline-none border resize-none ${inputProps.className || ""}`}
        style={{ borderColor: "#c7c4d7", background: T.primaryTint, color: T.ink, ...(inputProps.style || {}) }}
      />
    </div>
  );
}

// Small inline error banner used after a failed API call.
export function ErrorNotice({ text }) {
  if (!text) return null;
  return (
    <div className="rounded-lg px-3 py-2.5 font-['Inter'] text-[13px]" style={{ background: "#fee2e2", color: "#991b1b" }}>
      {text}
    </div>
  );
}

// Centered loading placeholder for a fetch in flight.
export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2 w-full">
      <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: T.primary, borderTopColor: "transparent" }} />
      <span className="font-['Inter'] text-[13px]" style={{ color: T.muted }}>{label}</span>
    </div>
  );
}

export function EmptyState({ text }) {
  return (
    <div className="flex items-center justify-center py-12 w-full">
      <span className="font-['Inter'] text-[13.5px]" style={{ color: T.faint }}>{text}</span>
    </div>
  );
}

// Flags a screen (or section of one) that has no matching backend endpoint
// yet, so it intentionally still runs on local/mock data. See CHANGELOG.md
// "Known limitations" for the full list and why.
export function MockDataNotice({ text = "Demo data — no backend endpoint exists for this yet." }) {
  return (
    <div className="flex items-center gap-2 rounded-lg px-3 py-2 mx-4" style={{ background: "#fef3c7", color: "#92400e" }}>
      <span className="font-['Inter'] text-[11px] font-semibold">⚠ {text}</span>
    </div>
  );
}
