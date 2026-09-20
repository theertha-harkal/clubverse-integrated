import { useEffect, useState } from "react";
import { MoreHorizontal, ThumbsUp, MessageCircle, Share2, Smile, Send } from "lucide-react";
import { T, TopBar, Tag, LoadingState, ErrorNotice } from "../../lib/ui";
import { PostsApi, ApiError } from "../../lib/api";

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

function CommentThread({ c }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-10 h-10 rounded-full shrink-0" style={{ background: T.primaryTint2 }} />
      <div className="flex-1 bg-white rounded-tr-2xl rounded-bl-2xl rounded-br-2xl p-4" style={{ border: "1px solid rgba(199,196,215,0.2)" }}>
        <div className="flex justify-between">
          <span className="font-['Hanken_Grotesk'] text-[15px]" style={{ color: T.ink }}>{c.userName}</span>
          <span className="font-['Inter'] text-[11px]" style={{ color: T.muted }}>{timeAgo(c.createdAt)}</span>
        </div>
        <div className="font-['Inter'] text-[13.5px] mt-1 leading-relaxed" style={{ color: T.muted }}>{c.content}</div>
        {c.replies?.length > 0 && (
          <div className="mt-3 pl-4 border-l-2 flex flex-col gap-3" style={{ borderColor: T.sky }}>
            {c.replies.map((r) => <CommentThread key={r.id} c={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PostDetail({ go, post: postProp }) {
  const [post, setPost] = useState(postProp || null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentAnon, setCommentAnon] = useState(false);
  const [posting, setPosting] = useState(false);

  const postId = postProp?.id;

  useEffect(() => {
    if (!postId) { setLoading(false); setError("No post selected."); return; }
    let cancelled = false;
    setLoading(true);
    Promise.all([PostsApi.get(postId), PostsApi.comments(postId)])
      .then(([p, c]) => { if (!cancelled) { setPost(p); setComments(c); } })
      .catch((err) => { if (!cancelled) setError(err instanceof ApiError ? err.message : "Couldn't load this post."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [postId]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !postId) return;
    setPosting(true);
    try {
      const created = await PostsApi.addComment(postId, { content: commentText, anonymous: commentAnon });
      setComments((prev) => [created, ...prev]);
      setCommentText("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't post your comment.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-24">
      <TopBar title="Post" onBack={() => go("home")} right={<MoreHorizontal size={16} color={T.ink} />} />

      {loading && <LoadingState label="Loading post…" />}
      {error && <div className="px-4"><ErrorNotice text={error} /></div>}

      {post && (
        <div className="flex flex-col gap-8">
          <div className="relative border overflow-hidden" style={{ borderColor: "rgba(199,196,215,0.3)", boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" }}>
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: "#ffb95f" }} />
            <div className="flex flex-col gap-6 p-6">
              <div className="flex gap-3 items-start">
                <div className="w-12 h-12 rounded-full shrink-0" style={{ background: T.primaryTint2 }} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-['Hanken_Grotesk'] font-semibold text-[19px]" style={{ color: T.ink }}>{post.userName}</span>
                    <span className="font-['Inter'] text-[13px]" style={{ color: T.muted }}>• {timeAgo(post.createdAt)}</span>
                  </div>
                  <div className="font-['Inter'] text-[13px]" style={{ color: T.muted }}>in <span className="font-semibold" style={{ color: T.primary }}>{post.community || "General"}</span></div>
                </div>
              </div>

              <div>
                <div className="font-['Hanken_Grotesk'] font-bold text-[24px] mb-3" style={{ color: T.ink }}>{post.title}</div>
                <div className="font-['Inter'] text-[15px] leading-relaxed" style={{ color: T.muted, whiteSpace: "pre-wrap" }}>{post.content}</div>
                {post.mediaUrl && <img src={post.mediaUrl} alt="" className="w-full rounded-lg mt-4" />}
              </div>

              <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${T.sky}` }}>
                <div className="flex gap-6 items-center">
                  <div className="flex gap-2 items-center"><ThumbsUp size={17} color={T.muted} /><span className="font-['Inter'] text-[15px]" style={{ color: T.muted }}>{post.likeCount}</span></div>
                  <div className="flex gap-2 items-center"><MessageCircle size={17} color={T.primary} /><span className="font-['Inter'] text-[15px]" style={{ color: T.primary }}>{comments.length}</span></div>
                  <Share2 size={16} color={T.faint} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 px-4">
            <div className="font-['Hanken_Grotesk'] font-semibold text-[19px]" style={{ color: T.ink }}>Comments ({comments.length})</div>
            {comments.length === 0 && <div className="font-['Inter'] text-[13.5px]" style={{ color: T.faint }}>No comments yet. Be the first!</div>}
            {comments.map((c) => <CommentThread key={c.id} c={c} />)}
          </div>
        </div>
      )}

      <form onSubmit={submitComment} className="fixed bottom-0 w-[390px] backdrop-blur px-4 pt-3 pb-3" style={{ background: "rgba(248,249,255,0.9)", borderTop: "1px solid rgba(199,196,215,0.3)" }}>
        <label className="flex items-center gap-2 mb-2 px-2 font-['Inter'] text-[13px]" style={{ color: T.muted }}>
          <input type="checkbox" className="w-4 h-4" checked={commentAnon} onChange={(e) => setCommentAnon(e.target.checked)} /> Reply anonymously
        </label>
        <div className="flex items-end gap-2 bg-white rounded-full p-1.5" style={{ border: "1px solid rgba(199,196,215,0.5)" }}>
          <Smile size={18} color={T.faint} className="ml-2 mb-2" />
          <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment..." className="flex-1 outline-none font-['Inter'] text-[14px] py-2 bg-transparent" />
          <button type="submit" disabled={posting} className="w-10 h-10 rounded-full flex items-center justify-center border-none cursor-pointer disabled:opacity-60" style={{ background: T.primary }}><Send size={15} color="white" /></button>
        </div>
      </form>
    </div>
  );
}
