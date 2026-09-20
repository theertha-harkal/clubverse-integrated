import { useEffect, useState } from "react";
import { Plus, Home, Calendar, MessageCircle, User } from "lucide-react";
import { T, BottomNav, LoadingState, ErrorNotice, EmptyState, Tag } from "../../lib/ui";
import { AnnouncementsApi, ApiError } from "../../lib/api";
import { useAuth } from "../../lib/auth";

function timeAgo(iso) {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Announcements({ go }) {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    AnnouncementsApi.listAll()
      .then((data) => { if (!cancelled) setAnnouncements(user ? data.filter((a) => a.createdBy === user.id) : data); })
      .catch((err) => { if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load announcements."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  return (
    <div className="flex flex-col pb-24">
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-10" style={{ background: T.page, boxShadow: "0px 1px 1px rgba(0,0,0,0.05)" }}>
        <div className="w-6" />
        <span className="font-['Hanken_Grotesk'] font-extrabold text-[22px]" style={{ color: T.primary }}>Announcements</span>
        <div className="w-4" />
      </div>
      <div className="flex flex-col gap-3 px-4 pt-4">
        {error && <ErrorNotice text={error} />}
        {loading && <LoadingState label="Loading announcements…" />}
        {!loading && !error && announcements.length === 0 && <EmptyState text="No announcements yet." />}
        {announcements.map(a => (
          <div key={a.id} className="bg-white rounded-2xl p-5 flex flex-col gap-2" style={{ border: "1px solid rgba(199,196,215,0.3)", boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between">
              <div className="font-['Hanken_Grotesk'] font-semibold text-[16px]" style={{ color: T.ink }}>{a.title}</div>
              <Tag bg={a.status === "PUBLISHED" ? "rgba(108,248,187,0.3)" : "#e5e0ff"} color={a.status === "PUBLISHED" ? "#00714d" : T.muted}>{a.status}</Tag>
            </div>
            <div className="font-['Inter'] text-[13px]" style={{ color: T.muted }}>{a.messageBody}</div>
            <div className="flex items-center justify-between pt-2 mt-1" style={{ borderTop: "1px solid rgba(199,196,215,0.2)" }}>
              <span className="font-['Inter'] text-[11.5px]" style={{ color: T.faint }}>{timeAgo(a.createdAt)}</span>
              <span className="font-['Inter'] text-[11.5px]" style={{ color: T.faint }}>{a.targetAudience}</span>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => go("createAnnouncement")} className="fixed right-4 bottom-24 w-14 h-14 rounded-full flex items-center justify-center border-none cursor-pointer" style={{ background: T.primary, boxShadow: "0px 4px 10px rgba(70,72,212,0.4)" }}><Plus size={20} color="white" /></button>
      <div className="fixed bottom-0 w-[390px] left-1/2 -translate-x-1/2">
        <BottomNav active="notifications" go={go} items={[
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
