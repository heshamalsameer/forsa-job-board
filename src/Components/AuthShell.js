import React from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { Header } from "./Header";
import { CompanyLogo } from "./CompanyLogo";
import { useJobs } from "../Context/Context";
import { CheckCircle, Close } from "./Icons";

export const AuthShell = ({ children }) => {
  const { jobs, toasts, user } = useJobs();
  const [params] = useSearchParams();
  if (user) return <Navigate to={params.get("next") || (user.loginby === "company" ? "/dashboard" : "/")} replace />;
  const sample = jobs.slice(0, 3);
  return (
    <>
      <Header />
      <div className="auth page">
        <aside className="auth-side">
          <div className="grid-bg" />
          <div style={{ position: "relative" }}>
            <h2>Your next role is <span className="serif">one click</span> away.</h2>
            <p>Thousands of people use Forsa to discover jobs, apply in minutes and hear back faster.</p>
          </div>
          <div className="float-cards" aria-hidden>
            {sample.map((j) => (
              <div className="float-card" key={j.id}>
                <CompanyLogo job={j} />
                <div><strong>{j.name}</strong><span>{j.company} · {j.city} · {j.mode}</span></div>
              </div>
            ))}
          </div>
          <p style={{ position: "relative", fontSize: 14 }}>“I got three interviews in my first week.” — Lina, Frontend Developer</p>
        </aside>
        <div className="auth-main">{children}</div>
      </div>
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => <div key={t.id} className={`toast ${t.tone}`}>{t.tone === "warn" ? <Close /> : <CheckCircle />}{t.text}</div>)}
      </div>
    </>
  );
};
