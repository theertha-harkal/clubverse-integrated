import { useState } from "react";
import { T, TextField, ErrorNotice } from "../../lib/ui";
import { useAuth } from "../../lib/auth";
import { ApiError } from "../../lib/api";

const imgContainer = "https://www.figma.com/api/mcp/asset/31ef3174-a518-4921-a07d-9e8e70914700.svg";
const imgContainer1 = "https://www.figma.com/api/mcp/asset/62a52a93-e3e9-4bf4-a389-ea5a6f22e8f6.svg";

export default function Login({ go }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "", rollNumber: "", batch: "", department: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
      go && go("home");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center justify-center pb-[40px] pt-[24px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 249, 255) 0%, rgb(248, 249, 255) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <div className="absolute bg-[rgba(96,99,238,0.2)] blur-[40px] inset-[7.96%_3.08%_28.23%_0] rounded-[9999px]" />
      <div className="absolute bg-[rgba(108,248,187,0.2)] blur-[40px] inset-[32.41%_-10%_0_7.44%] rounded-[9999px]" />
      <form onSubmit={submit} className="bg-white border border-[rgba(199,196,215,0.3)] border-solid flex flex-col items-start max-w-[440px] px-[25px] py-[33px] relative rounded-[12px] shrink-0 w-[358px] drop-shadow-[0px_4px_10px_rgba(0,0,0,0.05)] z-10 overflow-y-auto max-h-[95%]">
        <div className="flex flex-col items-center relative shrink-0 w-full pb-6">
          <div className="bg-[rgba(70,72,212,0.1)] flex items-center justify-center relative rounded-[12px] shrink-0 size-[64px] mb-6">
            <img alt="" className="size-8" src={imgContainer} />
          </div>
          <div className="font-['Hanken_Grotesk'] font-bold text-[#0d1c2e] text-[28px] text-center mb-3">Welcome to Clubverse</div>
          <div className="font-['Inter'] text-[#464554] text-[14px] text-center max-w-[280px] leading-5">Only verified college students can access Clubverse.</div>
        </div>

        <div className="flex gap-2 w-full mb-4 bg-[#eff4ff] rounded-full p-1">
          <button type="button" onClick={() => setMode("login")} className="flex-1 py-2 rounded-full font-['Inter'] font-semibold text-[13px] border-none cursor-pointer" style={{ background: mode === "login" ? T.primary : "transparent", color: mode === "login" ? "white" : T.muted }}>Sign in</button>
          <button type="button" onClick={() => setMode("register")} className="flex-1 py-2 rounded-full font-['Inter'] font-semibold text-[13px] border-none cursor-pointer" style={{ background: mode === "register" ? T.primary : "transparent", color: mode === "register" ? "white" : T.muted }}>Create account</button>
        </div>

        <div className="flex flex-col gap-3 items-start relative shrink-0 w-full">
          {mode === "register" && (
            <TextField label="Full name" required value={form.name} onChange={update("name")} placeholder="Jordan Lee" />
          )}
          <TextField label="College email" type="email" required value={form.email} onChange={update("email")} placeholder="name@university.edu" />
          <TextField label="Password" type="password" required value={form.password} onChange={update("password")} placeholder="••••••••" />
          {mode === "register" && (
            <>
              <TextField label="Roll number" value={form.rollNumber} onChange={update("rollNumber")} placeholder="2024BCD0016" />
              <div className="flex gap-3 w-full">
                <TextField label="Batch" value={form.batch} onChange={update("batch")} placeholder="2026" />
                <TextField label="Department" value={form.department} onChange={update("department")} placeholder="CSE" />
              </div>
            </>
          )}

          {error && <ErrorNotice text={error} />}

          <div className="flex flex-col items-start pt-4 relative shrink-0 w-full">
            <button type="submit" disabled={busy} className="bg-[#4648d4] flex gap-2 items-center justify-center py-3 relative rounded-full shrink-0 w-full cursor-pointer drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] disabled:opacity-60">
              <div className="font-['Hanken_Grotesk'] font-semibold text-[20px] text-center text-white">{busy ? "Please wait…" : mode === "login" ? "Continue" : "Create account"}</div>
              {!busy && <img alt="" className="w-[13px] h-[13px]" src={imgContainer1} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center pt-6 relative shrink-0 w-full">
          <div className="font-['Inter'] text-[#767586] text-[14px] text-center">Need help logging in?</div>
        </div>
      </form>
    </div>
  );
}
