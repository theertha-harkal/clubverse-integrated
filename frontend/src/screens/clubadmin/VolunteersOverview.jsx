import { useEffect, useMemo, useState } from "react";
import { Search, Award, Plus, X as XIcon, Home, Calendar, MessageCircle, User } from "lucide-react";
import { T, Pill, BottomNav, LoadingState, ErrorNotice, EmptyState, TextField, TextAreaField, PrimaryButton } from "../../lib/ui";
import { VolunteerApi, EventsApi, ApiError } from "../../lib/api";

const STATUS_STYLE = {
  PENDING: { bg: "rgba(163,103,0,0.15)", color: "#825100" },
  ACCEPTED: { bg: "rgba(108,248,187,0.3)", color: "#00714d" },
  REJECTED: { bg: "rgba(255,218,214,0.4)", color: "#ba1a1a" },
};

export default function VolunteersOverview({ go, openVolunteer }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [events, setEvents] = useState([]);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const opportunities = await VolunteerApi.opportunities();
        const lists = await Promise.all(
          opportunities.map((o) => VolunteerApi.applications(o.id).then((apps) => apps.map((a) => ({ ...a, opportunity: o }))))
        );
        if (!cancelled) setApplications(lists.flat());
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load volunteer applications.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [reload]);

  useEffect(() => {
    if (showCreate) EventsApi.list().then(setEvents).catch(() => {});
  }, [showCreate]);

  const visible = useMemo(() => {
    let list = applications;
    if (filter !== "All") list = list.filter((a) => a.status === filter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((a) => a.userName?.toLowerCase().includes(q) || a.role?.toLowerCase().includes(q));
    }
    return list;
  }, [applications, filter, query]);

  return (
    <div className="flex flex-col pb-24">
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-10" style={{ background: T.page, boxShadow: "0px 1px 1px rgba(0,0,0,0.05)" }}>
        <div className="w-6" />
        <span className="font-['Hanken_Grotesk'] font-extrabold text-[22px]" style={{ color: T.primary }}>Volunteers</span>
        <div className="w-4" />
      </div>
      <div className="px-4 pt-4 flex flex-col gap-4">
        <div className="relative">
          <Search size={16} color={T.faint} className="absolute left-4 top-1/2 -translate-y-1/2" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search volunteers..." className="w-full rounded-full border pl-11 pr-4 py-3 font-['Inter'] text-[14.5px] outline-none" style={{ borderColor: "#c7c4d7" }} />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {["All", "PENDING", "ACCEPTED", "REJECTED"].map((f) => <Pill key={f} active={f === filter} onClick={() => setFilter(f)}>{f === "All" ? "All" : f[0] + f.slice(1).toLowerCase()}</Pill>)}
        </div>
      </div>
      <div className="flex flex-col gap-3 px-4 mt-4">
        {error && <ErrorNotice text={error} />}
        {loading && <LoadingState label="Loading applications…" />}
        {!loading && !error && visible.length === 0 && <EmptyState text="No volunteer applications found." />}
        {visible.map(v => {
          const s = STATUS_STYLE[v.status] || STATUS_STYLE.PENDING;
          return (
            <div key={v.id} onClick={() => openVolunteer && openVolunteer(v)} className="bg-white rounded-2xl p-4 flex items-center gap-3 cursor-pointer" style={{ border: "1px solid rgba(199,196,215,0.3)", boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
              <div className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center font-['Inter'] font-bold text-[13px]" style={{ background: T.primaryTint2, color: T.primary }}>{v.userName?.slice(0, 2).toUpperCase()}</div>
              <div className="flex-1">
                <div className="font-['Hanken_Grotesk'] font-semibold text-[15px]" style={{ color: T.ink }}>{v.userName}</div>
                <div className="font-['Inter'] text-[12.5px]" style={{ color: T.muted }}>{v.role} · {v.opportunity?.eventTitle}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="rounded-full px-2.5 py-1 font-['Inter'] text-[11px]" style={{ background: s.bg, color: s.color }}>{v.status}</span>
                {v.opportunity?.rewardXp != null && <span className="flex items-center gap-1 font-['Inter'] font-bold text-[11.5px]" style={{ color: "#825100" }}><Award size={11} /> {v.opportunity.rewardXp} XP</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="fixed bottom-0 w-[390px] left-1/2 -translate-x-1/2">
        <BottomNav active="eventsManagement" go={go} items={[
          { key: "dashboard", icon: Home, label: "Home" },
          { key: "clubProfile", icon: User, label: "Club" },
          { key: "eventsManagement", icon: Calendar, label: "Events" },
          { key: "notifications", icon: MessageCircle, label: "Messages" },
          { key: "settings", icon: User, label: "Profile" },
        ]} />
      </div>

      <button onClick={() => setShowCreate(true)} className="fixed right-4 bottom-24 w-14 h-14 rounded-full flex items-center justify-center border-none cursor-pointer" style={{ background: T.primary, boxShadow: "0px 4px 10px rgba(70,72,212,0.4)" }}><Plus size={20} color="white" /></button>

      {showCreate && (
        <CreateOpportunityPanel
          events={events}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); setReload((n) => n + 1); }}
        />
      )}
    </div>
  );
}

function CreateOpportunityPanel({ events, onClose, onCreated }) {
  const [form, setForm] = useState({ eventId: "", role: "", team: "", requirements: "", rewardXp: "", applicationDeadline: "", totalSlots: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.eventId || !form.role.trim()) { setError("Event and role are required."); return; }
    setBusy(true);
    setError("");
    try {
      await VolunteerApi.createOpportunity({
        eventId: Number(form.eventId),
        role: form.role,
        team: form.team,
        requirements: form.requirements,
        rewardXp: form.rewardXp ? Number(form.rewardXp) : null,
        applicationDeadline: form.applicationDeadline || null,
        totalSlots: form.totalSlots ? Number(form.totalSlots) : null,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't create this opportunity.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center" style={{ background: "rgba(13,28,46,0.4)" }} onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="bg-white w-full max-w-[390px] rounded-t-3xl p-5 flex flex-col gap-3 max-h-[85%] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="font-['Hanken_Grotesk'] font-bold text-[19px]" style={{ color: T.ink }}>New volunteer opportunity</div>
          <button type="button" onClick={onClose} className="bg-transparent border-none cursor-pointer"><XIcon size={18} color={T.muted} /></button>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-['Inter'] font-bold text-[11px] tracking-wide uppercase" style={{ color: T.muted }}>Event</label>
          <select value={form.eventId} onChange={set("eventId")} className="w-full rounded-lg px-4 py-3 font-['Inter'] text-[15px] outline-none border" style={{ borderColor: "#c7c4d7", background: T.primaryTint }}>
            <option value="">Select an event…</option>
            {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
          </select>
        </div>
        <TextField label="Role" required value={form.role} onChange={set("role")} placeholder="e.g. Sound Engineer" />
        <TextField label="Team" value={form.team} onChange={set("team")} placeholder="e.g. Tech & AV" />
        <TextAreaField label="Requirements" rows={2} value={form.requirements} onChange={set("requirements")} placeholder="Skills or experience needed" />
        <div className="flex gap-3">
          <TextField label="Reward XP" type="number" value={form.rewardXp} onChange={set("rewardXp")} placeholder="e.g. 300" />
          <TextField label="Slots" type="number" value={form.totalSlots} onChange={set("totalSlots")} placeholder="e.g. 5" />
        </div>
        <TextField label="Application deadline" type="date" value={form.applicationDeadline} onChange={set("applicationDeadline")} />
        {error && <ErrorNotice text={error} />}
        <PrimaryButton className="mt-1">{busy ? "Creating…" : "Create opportunity"}</PrimaryButton>
      </form>
    </div>
  );
}
