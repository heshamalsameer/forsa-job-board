import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useJobs } from "../Context/Context";
import { Action_Types as actions } from "../Context/ActionsTypes";
import { Arrow, Building, Check, Eye, EyeOff, User } from "./Icons";
import { emailOk } from "./utils";

const strength = (p) => [p.length >= 6, /[A-Z]/.test(p) || /[^a-zA-Z0-9]/.test(p), /\d/.test(p), p.length >= 10].filter(Boolean).length;
const tones = ["var(--line)", "#e03131", "#f08c00", "#37b05a", "#1f7a3a"];

export const Formlogup = () => {
  const ctx = useJobs();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [user, setuser] = useState({ name: "", email: "", password: "", phone: "", loginby: "employee" });
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => { setuser({ ...user, [k]: e.target.value }); setErrors({ ...errors, [k]: "" }); };
  const score = strength(user.password);
  const isCompany = user.loginby === "company";

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!user.name.trim()) er.name = isCompany ? "Company name is required" : "Your name is required";
    if (!emailOk(user.email)) er.email = "Enter a valid email address";
    else if (ctx.users.some((item) => item.email.toLowerCase() === user.email.trim().toLowerCase())) er.email = "This email is already registered — try signing in";
    if (user.password.length < 6) er.password = "Use at least 6 characters";
    setErrors(er);
    if (Object.keys(er).length) return;
    const created = { ...user, name: user.name.trim(), email: user.email.trim().toLowerCase() };
    ctx.dispatch({ type: actions.ADD_USER, user: created });
    ctx.notify(`Account created — welcome, ${created.name.split(" ")[0]}!`);
    navigate(params.get("next") || (isCompany ? "/addnewjob" : "/"), { replace: true });
  };

  const roles = [
    { v: "employee", icon: User, title: "I’m looking for a job", text: "Search & apply to roles" },
    { v: "company", icon: Building, title: "I’m hiring", text: "Publish jobs & review applicants" },
  ];

  const field = (k, label, props = {}) => (
    <div className={`field ${errors[k] ? "error" : ""}`}>
      <label htmlFor={`su-${k}`}>{label}{props.optional && <small>Optional</small>}</label>
      <input id={`su-${k}`} className="input" value={user[k]} onChange={set(k)} {...props} optional={undefined} />
      {errors[k] && <span className="err">{errors[k]}</span>}
    </div>
  );

  return (
    <form className="auth-card" onSubmit={submit} noValidate>
      <h1>Create your account</h1>
      <p>It takes less than a minute. Choose how you’ll use Forsa.</p>

      <div className="role-cards" role="radiogroup" aria-label="Account type">
        {roles.map((r) => (
          <button type="button" key={r.v} role="radio" aria-checked={user.loginby === r.v} className={`role ${user.loginby === r.v ? "on" : ""}`} onClick={() => setuser({ ...user, loginby: r.v })}>
            <span className="tick">{user.loginby === r.v && <Check />}</span>
            <r.icon />
            <strong>{r.title}</strong>
            <span>{r.text}</span>
          </button>
        ))}
      </div>

      {field("name", isCompany ? "Company name" : "Full name", { autoComplete: isCompany ? "organization" : "name", placeholder: isCompany ? "Nimbus Labs" : "Sara Haddad" })}
      {field("email", isCompany ? "Work email" : "Email", { type: "email", autoComplete: "email", placeholder: "you@email.com" })}
      <div className={`field ${errors.password ? "error" : ""}`}>
        <label htmlFor="su-pass">Password</label>
        <div className="input-wrap">
          <input id="su-pass" className="input" type={show ? "text" : "password"} autoComplete="new-password" value={user.password} onChange={set("password")} placeholder="At least 6 characters" />
          <button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((s) => !s)}>{show ? <EyeOff /> : <Eye />}</button>
        </div>
        {user.password && <div className="strength" aria-hidden>{[1, 2, 3, 4].map((n) => <i key={n} style={{ background: score >= n ? tones[score] : undefined }} />)}</div>}
        {errors.password && <span className="err">{errors.password}</span>}
      </div>
      {field("phone", "Phone", { type: "tel", autoComplete: "tel", placeholder: "09xx xxx xxx", optional: true })}

      <button className="btn btn-primary btn-lg btn-block">Create account <Arrow /></button>
      <p className="auth-foot">Already have an account? <Link to={`/signin${params.get("next") ? `?next=${encodeURIComponent(params.get("next"))}` : ""}`}>Sign in</Link></p>
    </form>
  );
};
