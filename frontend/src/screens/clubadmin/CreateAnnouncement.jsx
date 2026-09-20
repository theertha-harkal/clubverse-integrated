import { useState } from "react";
import { X, Send, Bell } from "lucide-react";
import { T, TopBar, PrimaryButton, Notice, TextField, TextAreaField, ErrorNotice } from "../../lib/ui";
import { AnnouncementsApi, ApiError } from "../../lib/api";

// Announcement.TargetAudience on the backend is a strict enum - sending
// anything else (e.g. free-text "All students") throws a 400. Match it
// exactly rather than accepting arbitrary text.
const AUDIENCES = [
  { value: "ENTIRE_CAMPUS", label: "Entire campus" },
  { value: "CLUB_MEMBERS", label: "Club members" },
  { value: "EVENT_REGISTRANTS", label: "Event registrants" },
];

export default function CreateAnnouncement({ go }) {
  const [title, setTitle] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [targetAudience, setTargetAudience] = useState(AUDIENCES[0].value);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const publish = async (asDraft) => {
    if (!title.trim() || !messageBody.trim()) { setError("Title and message are required."); return; }
    setError("");
    setBusy(true);
    try {
      const payload = { title, messageBody, targetAudience, mediaUrl: null, eventId: null, scheduledAt: null };
      if (asDraft) await AnnouncementsApi.saveDraft(payload);
      else await AnnouncementsApi.create(payload);
      go("announcements");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't publish this announcement.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center pb-16">
      <TopBar title="New Announcement" onBack={() => go("announcements")} right={<X size={14} color={T.ink} />} />
      <div className="w-[358px] bg-white rounded-3xl p-6 mt-4 flex flex-col gap-5" style={{ border: "1px solid #c7c4d7", boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Welcome Week Schedule is Live!" />
        <TextAreaField label="Message" rows={5} value={messageBody} onChange={(e) => setMessageBody(e.target.value)} placeholder="Write your announcement..." />
        <div className="flex flex-col gap-1">
          <label className="font-['Inter'] font-bold text-[11px] tracking-wide uppercase" style={{ color: T.muted }}>Audience</label>
          <select value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="w-full rounded-lg px-4 py-3 font-['Inter'] text-[15px] outline-none border" style={{ borderColor: "#c7c4d7", background: T.primaryTint }}>
            {AUDIENCES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
          </select>
        </div>
        <Notice icon={Bell} text="Push notifications aren't implemented on the backend yet — this only publishes the announcement." />
        {error && <ErrorNotice text={error} />}
        <div className="flex flex-col gap-2">
          <button disabled={busy} onClick={() => publish(true)} className="w-full py-3 rounded-lg font-['Hanken_Grotesk'] font-semibold text-[16px] border cursor-pointer disabled:opacity-60" style={{ borderColor: T.primary, color: T.primary, background: "white" }}>Save as draft</button>
          <PrimaryButton onClick={() => publish(false)} disabled={busy} className="flex items-center justify-center gap-2">{busy ? "Publishing…" : <>Publish Announcement <Send size={14} /></>}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}
