import { useState } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { T, PrimaryButton, TextField, ErrorNotice } from "../../lib/ui";
import { useAuth } from "../../lib/auth";
import { ApiError } from "../../lib/api";

export default function AdminLogin({ go }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await login(email, password);
      if (user.role !== "CLUB_ADMIN" && user.role !== "PLATFORM_ADMIN") {
        setError("This account isn't a club admin account.");
        return;
      }
      go("dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-16 min-h-full relative overflow-hidden">
      <div className="absolute w-64 h-64 rounded-full -left-16 -top-16 opacity-40" style={{ background: "#e1e0ff", filter: "blur(32px)" }} />
      <div className="absolute w-80 h-80 rounded-full -right-16 bottom-0 opacity-30" style={{ background: "#6ffbbe", filter: "blur(50px)" }} />
      <div className="relative z-10 w-full max-w-[358px] flex flex-col gap-6">
        <form onSubmit={submit} className="bg-white border rounded-3xl p-8 flex flex-col gap-6" style={{ borderColor: "#d5e3fc", boxShadow: "0px 4px 10px rgba(0,0,0,0.05)" }}>
          <div className="flex flex-col items-center gap-1">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "#6063ee" }}><ShieldCheck size={26} color="white" /></div>
            <div className="font-['Hanken_Grotesk'] font-bold text-[24px] text-center mt-3" style={{ color: T.ink }}>Clubverse Club Admin</div>
            <div className="font-['Inter'] text-[13.5px] text-center" style={{ color: T.muted }}>Authorized club administrators only.</div>
          </div>
          <div className="flex flex-col gap-4">
            <TextField label="Official College Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@university.edu" />
            <TextField label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            {error && <ErrorNotice text={error} />}
            <PrimaryButton className="flex items-center justify-center gap-2 !rounded-full">{busy ? "Signing in…" : <>Sign in <ArrowRight size={14} /></>}</PrimaryButton>
          </div>
          <div className="font-['Inter'] text-[13px] text-center" style={{ color: T.muted }}>Need access? <span className="font-bold" style={{ color: T.primary }}>Contact Campus Life</span></div>
        </form>
        <div className="font-['Inter'] text-[12.5px] text-center opacity-80" style={{ color: T.muted }}>© 2026 Clubverse Platform. There's no account seeding in this build — ask a backend maintainer to promote a user to CLUB_ADMIN in the database.</div>
      </div>
    </div>
  );
}
