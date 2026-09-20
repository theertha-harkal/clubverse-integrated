import { useEffect, useState } from "react";
import { Megaphone, Plus } from "lucide-react";
import { T, Card, PrimaryButton, LoadingState, ErrorNotice, EmptyState } from "../../lib/ui";
import { AnnouncementsApi, ApiError } from "../../lib/api";
import CampusShell from "./Shell";

function timeAgo(iso) {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diffMs / 3600000);
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function CampusAnnouncements({ go }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    AnnouncementsApi.listPublished()
      .then((data) => { if (!cancelled) setItems(data); })
      .catch((err) => { if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load announcements."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <CampusShell go={go} active="campusAnnouncements" title="Campus Announcements" subtitle="Published announcements platform-wide.">
      <div className="flex justify-end mb-4">
        <PrimaryButton full={false} onClick={() => go("createAnnouncement")} className="flex items-center gap-2"><Plus size={14} /> New Announcement</PrimaryButton>
      </div>
      {error && <ErrorNotice text={error} />}
      {loading && <LoadingState label="Loading announcements…" />}
      {!loading && !error && items.length === 0 && <EmptyState text="No published announcements yet." />}
      <div className="flex flex-col gap-4">
        {items.map(a => (
          <Card key={a.id}>
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: T.primaryTint }}><Megaphone size={16} color={T.primary} /></div>
                <div>
                  <div className="font-['Hanken_Grotesk'] font-semibold text-[16px]" style={{ color: T.ink }}>{a.title}</div>
                  <div className="font-['Inter'] text-[13px] mt-1" style={{ color: T.muted }}>{a.messageBody}</div>
                  <div className="font-['Inter'] text-[12.5px] mt-1" style={{ color: T.faint }}>{a.targetAudience} · {timeAgo(a.createdAt)}</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </CampusShell>
  );
}
