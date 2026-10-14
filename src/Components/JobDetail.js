import React from "react";
import { Link } from "react-router-dom";
import { useJobs } from "../Context/Context";
import { CompanyLogo } from "./CompanyLogo";
import { Arrow, Bookmark, CheckCircle, Check, Pin, Users } from "./Icons";
import { modeTone, money, timeAgo } from "./utils";

export const JobDetail = ({ job, onApply, onNeedLogin }) => {
  const ctx = useJobs();
  if (!job) return null;
  const saved = ctx.savedIds.includes(job.id);
  const applied = ctx.hasApplied(job.id);
  const isCompany = ctx.user?.loginby === "company";
  const isOwner = ctx.user?.email === job.ownerEmail;
  const count = ctx.applicationsFor(job.id).length;

  return (
    <div className="detail-inner" key={job.id}>
      <div className="detail-head">
        <div className="cover" style={{ background: `linear-gradient(120deg, ${job.color || "var(--brand)"}, transparent)` }} />
        <CompanyLogo job={job} size="lg" />
        <h2>{job.name}</h2>
        <div className="company">
          <strong style={{ color: "var(--ink)" }}>{job.company}</strong>
          <span><Pin width={14} style={{ verticalAlign: -2 }} /> {job.city}</span>
          <span>Posted {timeAgo(job.postedAt)}</span>
        </div>
        <div className="meta" style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
          <span className={`badge ${modeTone[job.mode] || ""}`}><span className="dot" /> {job.mode}</span>
          <span className="badge">{job.hour}</span>
          <span className="badge">{job.level}</span>
          <span className="badge"><Users /> {count} applicant{count === 1 ? "" : "s"}</span>
        </div>
        <div className="detail-actions">
          {isOwner ? (
            <Link to={`/dashboard?job=${job.id}`} className="btn btn-primary">View applicants <Arrow /></Link>
          ) : isCompany ? (
            <span className="badge blue" style={{ height: 42, padding: "0 14px" }}>Company accounts can’t apply</span>
          ) : applied ? (
            <span className="applied-box" style={{ marginTop: 0 }}><CheckCircle /> You applied to this job</span>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={() => (ctx.user ? onApply(job) : onNeedLogin())}>Apply now <Arrow /></button>
          )}
          {!isCompany && (
            <button className={`btn ${saved ? "" : ""}`} onClick={() => (ctx.user ? (ctx.toggleSaved(job.id), ctx.notify(saved ? "Removed from saved jobs" : "Job saved for later")) : onNeedLogin())}
              style={saved ? { color: "var(--brand)", borderColor: "var(--brand)" } : undefined}>
              <Bookmark style={saved ? { fill: "currentColor" } : undefined} /> {saved ? "Saved" : "Save"}
            </button>
          )}
        </div>
      </div>
      <div className="facts">
        <div className="fact"><span>Salary / month</span><strong>{money(job.salary)}</strong></div>
        <div className="fact"><span>Experience</span><strong>{job.level}</strong></div>
        <div className="fact"><span>Job type</span><strong>{job.hour}</strong></div>
        <div className="fact"><span>Work mode</span><strong>{job.mode}</strong></div>
      </div>
      <div className="detail-body">
        <h4>About the role</h4>
        <p>{job.description}</p>
        {job.responsibilities?.length > 0 && (
          <>
            <h4>What you’ll do</h4>
            <ul>{job.responsibilities.map((r) => <li key={r}><Check /> {r}</li>)}</ul>
          </>
        )}
        {job.requirements?.length > 0 && (
          <>
            <h4>What we’re looking for</h4>
            <ul>{job.requirements.map((r) => <li key={r}><Check /> {r}</li>)}</ul>
          </>
        )}
        {job.skills?.length > 0 && (
          <>
            <h4>Skills</h4>
            <div className="skills">{job.skills.map((s) => <span key={s} className="skill">{s}</span>)}</div>
          </>
        )}
      </div>
    </div>
  );
};
