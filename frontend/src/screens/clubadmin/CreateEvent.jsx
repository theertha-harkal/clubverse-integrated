import { useState } from "react";
import { X, ImagePlus } from "lucide-react";
import { T, TopBar, ErrorNotice } from "../../lib/ui";
import { EventsApi, ApiError } from "../../lib/api";

function Field({ label, area, ...props }) {
  const Tag = area ? "textarea" : "input";
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="font-['Inter'] font-bold text-[11px] tracking-wide uppercase" style={{ color: T.muted }}>{label}</label>
      <Tag {...props} rows={area ? 4 : undefined} className="w-full rounded-lg px-4 py-3 font-['Inter'] text-[15px] outline-none resize-none" style={{ background: T.primaryTint }} />
    </div>
  );
}
function Toggle({ label, on, onClick }) {
  return (
    <div onClick={onClick} className="flex items-center justify-between w-full cursor-pointer">
      <span className="font-['Inter'] text-[15px]" style={{ color: T.ink }}>{label}</span>
      <div className="w-10 h-6 rounded-full relative" style={{ background: on ? T.primary : T.sky }}>
        <div className={`absolute w-4 h-4 rounded-full bg-white top-1 transition-all ${on ? "right-1" : "left-1"}`} />
      </div>
    </div>
  );
}

const initial = {
  title: "", description: "", posterUrl: "",
  eventDate: "", venue: "", startTime: "", endTime: "",
  eligibility: "All Students", maxRegistrations: "", registrationDeadline: "",
  volunteerRegistrationEnabled: false, rewardsEnabled: false, approvalRequired: true,
  rewardXp: "", featured: false, freeEntry: true, tags: "",
};

export default function CreateEvent({ go }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const toggle = (key) => () => setForm((f) => ({ ...f, [key]: !f[key] }));

  const buildPayload = () => ({
    ...form,
    maxRegistrations: form.maxRegistrations ? Number(form.maxRegistrations) : null,
    rewardXp: form.rewardXp ? Number(form.rewardXp) : null,
    eventDate: form.eventDate || null,
    registrationDeadline: form.registrationDeadline || null,
    startTime: form.startTime || null,
    endTime: form.endTime || null,
  });

  const submit = async (approvalRequired) => {
    // title, description, and eventDate are NOT NULL columns on the
    // backend (Event entity) - submitting without them fails with a raw
    // database constraint error, so validate them here first.
    if (!form.title.trim()) { setError("Event title is required."); return; }
    if (!form.description.trim()) { setError("Description is required."); return; }
    if (!form.eventDate) { setError("Event date is required."); return; }
    setError("");
    setBusy(true);
    try {
      await EventsApi.create({ ...buildPayload(), approvalRequired });
      go("eventsManagement");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't create the event.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center pb-16">
      <TopBar title="Create Event" onBack={() => go("eventsManagement")} right={<X size={14} color={T.ink} />} />
      <div className="w-[358px] bg-white rounded-3xl p-6 mt-4 flex flex-col gap-6" style={{ border: "1px solid #c7c4d7", boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
        <div className="flex flex-col gap-3">
          <div className="font-['Hanken_Grotesk'] font-semibold text-[18px] pb-2" style={{ color: T.ink, borderBottom: "1px solid #c7c4d7" }}>Basic Information</div>
          <Field label="Event title" placeholder="e.g., Annual Tech Symposium" value={form.title} onChange={set("title")} />
          <Field label="Description" placeholder="Describe what the event is about..." area value={form.description} onChange={set("description")} />
          <Field label="Poster image URL" placeholder="https://…" value={form.posterUrl} onChange={set("posterUrl")} />
          <div className="mt-1 h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1" style={{ borderColor: "#c7c4d7", background: T.primaryTint }}>
            <ImagePlus size={18} color={T.muted} />
            <span className="font-['Inter'] text-[12px]" style={{ color: T.muted }}>File upload isn't implemented — paste an image URL above.</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="font-['Hanken_Grotesk'] font-semibold text-[18px] pb-2" style={{ color: T.ink, borderBottom: "1px solid #c7c4d7" }}>Logistics</div>
          <Field label="Date" type="date" value={form.eventDate} onChange={set("eventDate")} />
          <Field label="Venue" placeholder="e.g., Student Union Room 301" value={form.venue} onChange={set("venue")} />
          <Field label="Start time" type="time" value={form.startTime} onChange={set("startTime")} />
          <Field label="End time" type="time" value={form.endTime} onChange={set("endTime")} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="font-['Hanken_Grotesk'] font-semibold text-[18px] pb-2" style={{ color: T.ink, borderBottom: "1px solid #c7c4d7" }}>Registration & Rules</div>
          <Field label="Eligibility" placeholder="All Students" value={form.eligibility} onChange={set("eligibility")} />
          <Field label="Max registrations" type="number" placeholder="e.g., 50" value={form.maxRegistrations} onChange={set("maxRegistrations")} />
          <Field label="Deadline" type="date" value={form.registrationDeadline} onChange={set("registrationDeadline")} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="font-['Hanken_Grotesk'] font-semibold text-[18px] pb-2" style={{ color: T.ink, borderBottom: "1px solid #c7c4d7" }}>Options</div>
          <Toggle label="Enable volunteer registration" on={form.volunteerRegistrationEnabled} onClick={toggle("volunteerRegistrationEnabled")} />
          <Toggle label="Enable rewards" on={form.rewardsEnabled} onClick={toggle("rewardsEnabled")} />
          {form.rewardsEnabled && <Field label="Reward XP" type="number" placeholder="e.g., 200" value={form.rewardXp} onChange={set("rewardXp")} />}
          <Toggle label="Require campus approval before publishing" on={form.approvalRequired} onClick={toggle("approvalRequired")} />
        </div>

        {error && <ErrorNotice text={error} />}

        <div className="flex flex-col gap-3 pt-4" style={{ borderTop: "1px solid #c7c4d7" }}>
          <button disabled={busy} onClick={() => submit(false)} className="w-full py-3 rounded-lg font-['Hanken_Grotesk'] font-semibold text-[17px] border cursor-pointer disabled:opacity-60" style={{ borderColor: T.primary, color: T.primary, background: "white" }}>Save & Publish directly</button>
          <button disabled={busy} onClick={() => submit(true)} className="w-full py-3 rounded-lg font-['Hanken_Grotesk'] font-semibold text-[17px] text-white border-none cursor-pointer disabled:opacity-60" style={{ background: T.primary }}>{busy ? "Submitting…" : "Submit for Approval"}</button>
        </div>
      </div>
    </div>
  );
}
