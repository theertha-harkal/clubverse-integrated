import { useState } from "react";
import { X, ShieldCheck } from "lucide-react";
import { T, PrimaryButton, TextField, TextAreaField, ErrorNotice } from "../../lib/ui";
import { PostsApi, ApiError } from "../../lib/api";

export default function CreatePost({ go }) {
  const [community, setCommunity] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await PostsApi.create({ community: community || "General", title, content, mediaUrl: mediaUrl || null, anonymous });
      go("home");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't publish your post.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-center pb-24 bg-white min-h-full">
      <div className="flex items-center justify-between w-full px-4 py-3" style={{ background: T.page, boxShadow: "0px 1px 1px rgba(0,0,0,0.05)" }}>
        <button onClick={() => go("home")} className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent border-none cursor-pointer"><X size={16} color={T.ink} /></button>
        <div className="flex-1 text-center font-['Hanken_Grotesk'] font-extrabold text-[22px]" style={{ color: T.primary }}>Create a post</div>
        <div className="w-8" />
      </div>

      <form onSubmit={submit} className="w-full max-w-[420px] px-4 pt-8 flex flex-col gap-6">
        <TextField label="Community" value={community} onChange={(e) => setCommunity(e.target.value)} placeholder="e.g. Design Society, CS201 Batch" />
        <TextField label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your post a catchy title" />
        <TextAreaField label="Content" required rows={5} value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's on your mind?" />
        <TextField label="Media URL (optional)" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://…" />

        <div className="flex items-center justify-between py-3" style={{ borderTop: "1px solid rgba(199,196,215,0.3)", borderBottom: "1px solid rgba(199,196,215,0.3)" }}>
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full shrink-0" style={{ background: T.sky }} />
            <div>
              <div className="font-['Hanken_Grotesk'] font-semibold text-[17px]" style={{ color: T.ink }}>Post anonymously</div>
              <div className="font-['Inter'] text-[12px]" style={{ color: T.muted }}>Your name will be hidden.</div>
            </div>
          </div>
          <button type="button" onClick={() => setAnonymous((a) => !a)} className="w-11 h-6 rounded-full relative border-none cursor-pointer" style={{ background: anonymous ? T.primary : "#c7c4d7" }}>
            <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-all ${anonymous ? "right-0.5" : "left-0.5"}`} />
          </button>
        </div>

        <div className="flex gap-3 items-start rounded-lg p-3" style={{ background: T.primaryTint }}>
          <ShieldCheck size={16} color={T.primary} className="mt-0.5 shrink-0" />
          <div className="font-['Inter'] text-[13px]" style={{ color: T.muted }}>
            <span className="font-semibold" style={{ color: T.ink }}>Note:</span> content moderation isn't implemented on the backend yet — posts publish immediately.
          </div>
        </div>

        {error && <ErrorNotice text={error} />}

        <PrimaryButton className="!py-4 !text-[18px]">{busy ? "Posting…" : "Post"}</PrimaryButton>
      </form>
    </div>
  );
}
