import { useState } from "react";
import { Landmark, ArrowRight } from "lucide-react";
import { T, PrimaryButton, TextField, ErrorNotice } from "../../lib/ui";
import { useAuth } from "../../lib/auth";
import { ApiError } from "../../lib/api";

export default function CampusLogin({ go }) {
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
      if (user.role !== "PLATFORM_ADMIN") {
        setError("This account isn't a platform/campus admin account.");
        return;
      }
      go("campusDashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: T.ink }}>
      <form onSubmit={submit} className="w-[400px] bg-white rounded-3xl p-9 flex flex-col gap-6" style={{ boxShadow: "0px 20px 40px rgba(0,0,0,0.3)" }}>
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: T.ink }}><Landmark size={26} color={T.mint} /></div>
          <div className="font-['Hanken_Grotesk'] font-bold text-[24px] text-center mt-2" style={{ color: T.ink }}>Clubverse Campus Admin</div>
          <div className="font-['Inter'] text-[13.5px] text-center" style={{ color: T.muted }}>University-level oversight & moderation.</div>
        </div>
        <div className="flex flex-col gap-4">
          <TextField label="Staff Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="dean.affairs@university.edu" />
          <TextField label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          {error && <ErrorNotice text={error} />}
          <PrimaryButton className="flex items-center justify-center gap-2">{busy ? "Signing in…" : <>Sign in <ArrowRight size={14} /></>}</PrimaryButton>
        </div>
        <div className="font-['Inter'] text-[12.5px] text-center" style={{ color: T.muted }}>Restricted to authorized Campus Life & IT staff. This account role (PLATFORM_ADMIN) must be granted directly in the database — there's no self-service signup.</div>
      </form>
    </div>
  );
}
