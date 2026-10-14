import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "../Components/Layout";
import { CompanyLogo } from "../Components/CompanyLogo";
import { Jobitem } from "../Components/Jobitem";
import { useJobs } from "../Context/Context";
import { Action_Types as actions } from "../Context/ActionsTypes";
import { Arrow, Bookmark, Briefcase, Check, Close } from "../Components/Icons";
import { timeAgo } from "../Components/utils";
import { statusLabel, statusTone } from "../Components/Employeeinfo";

const Track = ({ status }) => {
  const reviewed = status !== "new";
  const last = status === "rejected" ? "bad" : status === "shortlisted" ? "done" : "";
  return (
    <div className="track" aria-label={`Status: ${statusLabel[status]}`}>
      <div className="st done"><i><Check /></i><span>Applied</span></div>
      <div className="ln done" />
      <div className={`st ${reviewed ? "done" : ""}`}><i>{reviewed && <Check />}</i><span>In review</span></div>
      <div className={`ln ${reviewed ? "done" : ""}`} />
      <div className={`st ${last}`}><i>{status === "rejected" ? <Close /> : status === "shortlisted" ? <Check /> : null}</i><span>{status === "rejected" ? "Not selected" : "Shortlisted"}</span></div>
    </div>
  );
};

export const Applications = () => {
  const ctx = useJobs();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "saved" ? "saved" : "applied";
  const mine = ctx.employees.filter((a) => a.email === ctx.user.email).sort((a, b) => b.at - a.at);
  const saved = ctx.jobs.filter((j) => ctx.savedIds.includes(j.id));

  const withdraw = (a) => {
    ctx.dispatch({ type: actions.REMOVE_FROM_EMPLOYEES, appId: a.appId });
    ctx.notify("Application withdrawn", "warn");
  };

  return (
    <Layout>
      <div className="container" style={{ paddingBottom: 60, maxWidth: 900 }}>
        <div className="page-head">
          <div>
            <h1>My applications</h1>
            <p>Track where you stand and keep an eye on jobs you saved.</p>
          </div>
          <Link to="/" className="btn"><Briefcase /> Browse jobs</Link>
        </div>

        <div className="tabs">
          <button className={tab === "applied" ? "on" : ""} onClick={() => setParams({})}>Applied <span className="count">{mine.length}</span></button>
          <button className={tab === "saved" ? "on" : ""} onClick={() => setParams({ tab: "saved" })}>Saved <span className="count">{saved.length}</span></button>
        </div>

        {tab === "applied" ? (
          mine.length === 0 ? (
            <div className="panel empty">
              <div className="ic"><Briefcase /></div>
              <h3>No applications yet</h3>
              <p>When you apply to a job, you can follow its progress here.</p>
              <Link to="/" className="btn btn-primary">Find jobs <Arrow /></Link>
            </div>
          ) : (
            mine.map((a, i) => {
              const job = ctx.jobs.find((j) => j.id === a.id);
              if (!job) return null;
              return (
                <div key={a.appId} className="panel app-card" style={{ "--i": i }}>
                  <CompanyLogo job={job} />
                  <div style={{ minWidth: 0 }}>
                    <Link to={`/?job=${job.id}`}><strong style={{ fontSize: 16 }}>{job.name}</strong></Link>
                    <div className="muted" style={{ fontSize: 13.5 }}>{job.company} · {job.city} · applied {timeAgo(a.at)}</div>
                    <Track status={a.status} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                    <span className={`badge ${statusTone[a.status]}`}>{statusLabel[a.status]}</span>
                    <button className="btn btn-sm btn-ghost btn-danger" onClick={() => withdraw(a)}>Withdraw</button>
                  </div>
                </div>
              );
            })
          )
        ) : saved.length === 0 ? (
          <div className="panel empty">
            <div className="ic"><Bookmark /></div>
            <h3>No saved jobs</h3>
            <p>Tap the bookmark on any job to keep it here for later.</p>
            <Link to="/" className="btn btn-primary">Find jobs <Arrow /></Link>
          </div>
        ) : (
          <div className="jobs">
            {saved.map((j, i) => <Jobitem key={j.id} job={j} index={i} onSelect={(id) => window.location.assign(`#/?job=${id}`)} />)}
          </div>
        )}
      </div>
    </Layout>
  );
};
