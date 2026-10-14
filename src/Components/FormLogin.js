import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useJobs } from "../Context/Context";
import { Action_Types as actions } from "../Context/ActionsTypes";
import { Arrow, Building, Eye, EyeOff, User } from "./Icons";
import { emailOk } from "./utils";

export const Formlogin = () => {
  const ctx = useJobs();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [user, setuser] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const finish = (found) => {
    ctx.dispatch({ type: actions.LOGIN, email: found.email });
    ctx.notify(`Welcome back, ${found.name.split(" ")[0]}!`);
    const next = params.get("next");
    navigate(next || (found.loginby === "company" ? "/dashboard" : "/"), { replace: true });
  };

  const CheckUser = (e) => {
    e.preventDefault();
    if (!emailOk(user.email) || !user.password) return setError("Enter your email and password.");
    setBusy(true);
    setTimeout(() => {
      const found = ctx.users.find((item) => item.email.toLowerCase() === user.email.trim().toLowerCase() && item.password === user.password);
      setBusy(false);
      if (!found) return setError("We couldn’t find an account with that email and password.");
      finish(found);
      return undefined;
    }, 450);
    return undefined;
  };

  const demo = (email) => {
    const found = ctx.users.find((u) => u.email === email);
    if (found) finish(found);
  };

  return (
    <form className="auth-card" onSubmit={CheckUser} noValidate>
      <h1>Welcome back</h1>
      <p>Sign in to apply, save jobs and track your applications.</p>

      <div className="field">
        <label htmlFor="li-email">Email</label>
        <input id="li-email" className="input" type="email" autoComplete="email" autoFocus value={user.email} onChange={(e) => { setuser({ ...user, email: e.target.value }); setError(""); }} placeholder="you@email.com" />
      </div>
      <div className="field">
        <label htmlFor="li-pass">Password</label>
        <div className="input-wrap">
          <input id="li-pass" className="input" type={show ? "text" : "password"} autoComplete="current-password" value={user.password} onChange={(e) => { setuser({ ...user, password: e.target.value }); setError(""); }} placeholder="••••••••" />
          <button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((s) => !s)}>{show ? <EyeOff /> : <Eye />}</button>
        </div>
      </div>
      {error && <div className="badge red" style={{ height: "auto", padding: "10px 12px", borderRadius: 10, width: "100%", marginBottom: 14, whiteSpace: "normal" }}>{error}</div>}
      <button className="btn btn-primary btn-lg btn-block" disabled={busy}>{busy ? "Signing in…" : <>Sign in <Arrow /></>}</button>

      <div className="divider">or try a demo account</div>
      <div className="demo">
        <button type="button" className="btn" onClick={() => demo("seeker@forsa.dev")}><User /> Job seeker</button>
        <button type="button" className="btn" onClick={() => demo("company@forsa.dev")}><Building /> Company</button>
      </div>
      <p className="auth-foot">Don’t have an account? <Link to={`/signup${params.get("next") ? `?next=${encodeURIComponent(params.get("next"))}` : ""}`}>Create one</Link></p>
    </form>
  );
};
