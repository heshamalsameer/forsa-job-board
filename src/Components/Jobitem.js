import React from "react";
import { useJobs } from "../Context/Context";
import { CompanyLogo } from "./CompanyLogo";
import { Bookmark, Clock, Pin } from "./Icons";
import { isNew, modeTone, money, timeAgo } from "./utils";

export const Jobitem = ({ job, selected, onSelect, index = 0, onNeedLogin }) => {
  const ctx = useJobs();
  const saved = ctx.savedIds.includes(job.id);
  const applied = ctx.hasApplied(job.id);

  const toggle = (e) => {
    e.stopPropagation();
    if (!ctx.user) return onNeedLogin?.();
    ctx.toggleSaved(job.id);
    ctx.notify(saved ? "Removed from saved jobs" : "Job saved for later");
    return undefined;
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`job-card ${selected ? "selected" : ""}`}
      style={{ "--i": index }}
      onClick={() => onSelect(job.id)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(job.id))}
      aria-pressed={selected}
    >
      <CompanyLogo job={job} />
      <div style={{ minWidth: 0 }}>
        <h3>{job.name}</h3>
        <div className="company">{job.company} · <Pin width={13} style={{ verticalAlign: -2 }} /> {job.city}</div>
        <div className="meta">
          <span className={`badge ${modeTone[job.mode] || ""}`}>{job.mode}</span>
          <span className="badge"><Clock /> {job.hour}</span>
          <span className="badge amber">{money(job.salary)}</span>
          {applied && <span className="badge green">Applied</span>}
        </div>
      </div>
      <div className="side">
        <button className={`save-btn ${saved ? "on" : ""}`} aria-label={saved ? "Unsave job" : "Save job"} onClick={toggle}><Bookmark /></button>
        <div style={{ textAlign: "right" }}>
          {isNew(job.postedAt) && <div className="new-pill">New</div>}
          <div className="time">{timeAgo(job.postedAt)}</div>
        </div>
      </div>
    </div>
  );
};
