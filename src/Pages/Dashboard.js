import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "../Components/Layout";
import { Drawer, Modal } from "../Components/Modal";
import { Employeeinfo, statusLabel, statusTone } from "../Components/Employeeinfo";
import { CompanyLogo } from "../Components/CompanyLogo";
import { useJobs } from "../Context/Context";
import { Action_Types as actions } from "../Context/ActionsTypes";
import { Briefcase, Check, Close, Eye, File, Plus, Spark, Trash, Users } from "../Components/Icons";
import { colorFor, initials, timeAgo } from "../Components/utils";

export const Dashboard = () => {
  const ctx = useJobs();
  const [params, setParams] = useSearchParams();
  const [info, setInfo] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [tab, setTab] = useState("all");
  const mine = useMemo(() => ctx.jobs.filter((j) => j.ownerEmail === ctx.user.email), [ctx.jobs, ctx.user]);
  const apps = ctx.employees.filter((a) => mine.some((j) => j.id === a.id));
  const openJob = mine.find((j) => j.id === params.get("job"));
  const jobApps = openJob ? ctx.applicationsFor(openJob.id).filter((a) => tab === "all" || a.status === tab) : [];
  const max = Math.max(1, ...mine.map((j) => ctx.applicationsFor(j.id).length));

  const setStatus = (a, status) => {
    ctx.dispatch({ type: actions.SET_APPLICATION_STATUS, appId: a.appId, status });
    ctx.notify(status === "shortlisted" ? `${a.name} shortlisted` : status === "rejected" ? `${a.name} marked as not a fit` : "Status updated", status === "rejected" ? "warn" : "ok");
    if (info?.appId === a.appId) setInfo({ ...a, status });
  };
  const remove = (a) => {
    ctx.dispatch({ type: actions.REMOVE_FROM_EMPLOYEES, appId: a.appId });
    ctx.notify("Application deleted", "warn");
  };
  const close = () => { setParams({}, { replace: true }); setTab("all"); };

  const kpis = [
    { label: "Active jobs", value: mine.length, icon: Briefcase, tone: "green" },
    { label: "Total applicants", value: apps.length, icon: Users, tone: "blue" },
    { label: "New to review", value: apps.filter((a) => a.status === "new").length, icon: Spark, tone: "amber" },
    { label: "Shortlisted", value: apps.filter((a) => a.status === "shortlisted").length, icon: Check, tone: "violet" },
  ];

  return (
    <Layout>
      <div className="container" style={{ paddingBottom: 60 }}>
        <div className="page-head">
          <div>
            <h1>Hi, {ctx.user.name.split(" ")[0]} 👋</h1>
            <p>Here’s how your job posts are doing.</p>
          </div>
          <Link to="/addnewjob" className="btn btn-primary btn-lg"><Plus /> Post a job</Link>
        </div>

        <div className="kpis">
          {kpis.map((k) => (
            <div key={k.label} className="panel kpi">
              <span>{k.label}</span>
              <strong>{k.value}</strong>
              <div className={`ic badge ${k.tone}`} style={{ padding: 0 }}><k.icon /></div>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="row" style={{ padding: "16px 18px", borderBottom: "1px solid var(--line)" }}>
            <strong>Your job posts</strong>
            <span className="badge">{mine.length}</span>
          </div>
          {mine.length === 0 ? (
            <div className="empty">
              <div className="ic"><Briefcase /></div>
              <h3>No jobs posted yet</h3>
              <p>Publish your first role — it only takes a couple of minutes.</p>
              <Link to="/addnewjob" className="btn btn-primary"><Plus /> Post a job</Link>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Job</th><th>Applicants</th><th>New</th><th>Posted</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
                <tbody>
                  {mine.map((j) => {
                    const list = ctx.applicationsFor(j.id);
                    const fresh = list.filter((a) => a.status === "new").length;
                    return (
                      <tr key={j.id}>
                        <td>
                          <div className="row">
                            <CompanyLogo job={j} />
                            <div>
                              <strong>{j.name}</strong>
                              <div className="muted" style={{ fontSize: 13 }}>{j.city} · {j.mode} · {j.hour}</div>
                            </div>
                          </div>
                        </td>
                        <td><div className="row"><strong style={{ minWidth: 18 }}>{list.length}</strong><div className="bar-mini"><i style={{ width: `${(list.length / max) * 100}%` }} /></div></div></td>
                        <td>{fresh ? <span className="badge amber">{fresh} new</span> : <span className="muted">—</span>}</td>
                        <td className="muted">{timeAgo(j.postedAt)}</td>
                        <td>
                          <div className="row" style={{ justifyContent: "flex-end", gap: 6 }}>
                            <button className="btn btn-sm" onClick={() => setParams({ job: j.id })}><Users /> Applicants</button>
                            <Link className="btn btn-sm btn-ghost" to={`/?job=${j.id}`} aria-label="View post"><Eye /></Link>
                            <button className="btn btn-sm btn-ghost btn-danger" aria-label="Delete job" onClick={() => setConfirm(j)}><Trash /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Drawer
        open={!!openJob}
        onClose={close}
        header={openJob && (
          <div className="row">
            <CompanyLogo job={openJob} />
            <div style={{ minWidth: 0 }}>
              <strong>{openJob.name}</strong>
              <div className="muted" style={{ fontSize: 13 }}>{ctx.applicationsFor(openJob.id).length} applicants</div>
            </div>
          </div>
        )}
      >
        {openJob && (
          <>
            <div className="tabs" style={{ margin: "-6px 0 16px" }}>
              {["all", "new", "shortlisted", "rejected"].map((t) => (
                <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
                  {t === "all" ? "All" : statusLabel[t]}
                  <span className="count">{ctx.applicationsFor(openJob.id).filter((a) => t === "all" || a.status === t).length}</span>
                </button>
              ))}
            </div>
            {jobApps.length === 0 ? (
              <div className="empty">
                <div className="ic"><Users /></div>
                <h3>{tab === "all" ? "No one has applied yet" : "Nobody here"}</h3>
                <p>{tab === "all" ? "Share your post — new applicants will appear here instantly." : "Change the filter to see other applicants."}</p>
              </div>
            ) : (
              jobApps.map((a, i) => (
                <div key={a.appId} className="applicant" style={{ "--i": i }}>
                  <span className="avatar" style={{ background: colorFor(a.name) }}>{initials(a.name)}</span>
                  <div style={{ minWidth: 0 }}>
                    <strong>{a.name}</strong>
                    <div className="muted" style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis" }}>{a.email} · {timeAgo(a.at)}</div>
                  </div>
                  <span className={`badge ${statusTone[a.status]}`}>{statusLabel[a.status]}</span>
                  {a.note && <div className="note">“{a.note}”</div>}
                  <div className="acts">
                    <button className="btn btn-sm" onClick={() => setInfo(a)}><File /> View details</button>
                    {a.status !== "shortlisted" && <button className="btn btn-sm" onClick={() => setStatus(a, "shortlisted")}><Check /> Shortlist</button>}
                    {a.status !== "rejected" && <button className="btn btn-sm btn-danger" onClick={() => setStatus(a, "rejected")}><Close /> Not a fit</button>}
                    <div className="spacer" />
                    <button className="btn btn-sm btn-ghost btn-danger" aria-label="Delete application" onClick={() => remove(a)}><Trash /></button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </Drawer>

      <Employeeinfo employee={info} job={openJob} onClose={() => setInfo(null)} onStatus={(s) => info && setStatus(info, s)} />

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title="Delete this job?"
        subtitle={confirm ? `“${confirm.name}” and its ${ctx.applicationsFor(confirm.id).length} applications will be removed.` : ""}
        icon={<span className="logo-box" style={{ background: "var(--red-soft)", color: "var(--red)" }}><Trash width={20} /></span>}
        footer={
          <>
            <button className="btn" onClick={() => setConfirm(null)}>Cancel</button>
            <button className="btn btn-primary" style={{ background: "var(--red)", borderColor: "var(--red)", color: "#fff", boxShadow: "none" }}
              onClick={() => { ctx.dispatch({ type: actions.DELETE_JOB, id: confirm.id }); ctx.notify("Job deleted", "warn"); setConfirm(null); }}>
              Delete job
            </button>
          </>
        }
      >
        <div className="modal-body muted" style={{ fontSize: 14 }}>This can’t be undone.</div>
      </Modal>
    </Layout>
  );
};
