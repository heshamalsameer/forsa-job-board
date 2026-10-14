import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "./Layout";
import { useJobs } from "../Context/Context";
import { Action_Types as actions } from "../Context/ActionsTypes";
import { addjobname, cities, hours, levels, modes } from "../Context/initial";
import { Typewriter } from "./Typewriter";
import { Jobitem } from "./Jobitem";
import { Arrow, Close, Spark } from "./Icons";
import { colorFor } from "./utils";

const empty = {
  name: "", hour: "Full time", city: "", mode: "Onsite", level: "Mid-level", min: "", max: "",
  description: "", responsibilities: "", requirements: "", skills: [], image: "",
};

export const Addnewjob = () => {
  const ctx = useJobs();
  const navigate = useNavigate();
  const [job, setjob] = useState(empty);
  const [skill, setSkill] = useState("");
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => { setjob({ ...job, [k]: e.target.value }); setErrors({ ...errors, [k]: "" }); };

  const addSkill = (e) => {
    if ((e.key === "Enter" || e.key === ",") && skill.trim()) {
      e.preventDefault();
      if (!job.skills.includes(skill.trim()) && job.skills.length < 8) setjob({ ...job, skills: [...job.skills, skill.trim()] });
      setSkill("");
    }
    if (e.key === "Backspace" && !skill && job.skills.length) setjob({ ...job, skills: job.skills.slice(0, -1) });
  };

  const lines = (t) => t.split("\n").map((l) => l.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);
  const company = ctx.user?.name || "Your company";
  const preview = {
    id: "preview", name: job.name || "Job title", company, color: ctx.jobs.find((j) => j.ownerEmail === ctx.user?.email)?.color || colorFor(company), city: job.city || "City", mode: job.mode, hour: job.hour,
    level: job.level, salary: job.min && job.max ? [+job.min, +job.max] : null, skills: job.skills, postedAt: Date.now(), image: job.image,
  };

  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!job.name) er.name = "Choose a job title";
    if (!job.city) er.city = "Choose a city";
    if (job.description.trim().length < 30) er.description = "Write at least 30 characters so candidates know what the job is about";
    if ((job.min || job.max) && (!job.min || !job.max || +job.min > +job.max)) er.salary = "Enter a valid range (min ≤ max)";
    setErrors(er);
    if (Object.keys(er).length) {
      ctx.notify("Please fix the highlighted fields", "warn");
      return;
    }
    const created = {
      ...preview, id: `j${Date.now()}`, ownerEmail: ctx.user.email, description: job.description.trim(),
      responsibilities: lines(job.responsibilities), requirements: lines(job.requirements),
    };
    ctx.dispatch({ type: actions.ADD_JOB, job: created });
    ctx.notify("Your job is live!");
    navigate(`/?job=${created.id}`);
  };

  const err = (k) => errors[k] && <span className="err">{errors[k]}</span>;

  return (
    <Layout>
      <div className="container">
        <div className="page-head">
          <div>
            <div className="crumbs"><Link to="/dashboard">Dashboard</Link> / <span>Post a job</span></div>
            <h1>Post a new job</h1>
            <p><Typewriter text="You’re welcome! Add a new job opportunity — just enter the details and wait for applicants." time={22} /></p>
          </div>
        </div>

        <div className="post-grid">
          <form className="panel form-card" onSubmit={submit} noValidate>
            <div className="form-section">
              <h3>Basics</h3>
              <p>The essentials candidates scan first.</p>
              <div className={`field ${errors.name ? "error" : ""}`}>
                <label htmlFor="pj-name">Job title</label>
                <select id="pj-name" className="select" value={job.name} onChange={set("name")}>
                  <option value="">Select a title…</option>
                  {addjobname.map((n) => <option key={n}>{n}</option>)}
                </select>
                {err("name")}
              </div>
              <div className="grid-2">
                <div className="field">
                  <label>Job type</label>
                  <div className="seg">{hours.map((h) => <button type="button" key={h} className={job.hour === h ? "on" : ""} onClick={() => setjob({ ...job, hour: h })}>{h}</button>)}</div>
                </div>
                <div className="field">
                  <label>Work mode</label>
                  <div className="seg">{modes.map((m) => <button type="button" key={m} className={job.mode === m ? "on" : ""} onClick={() => setjob({ ...job, mode: m })}>{m}</button>)}</div>
                </div>
              </div>
              <div className="grid-2">
                <div className={`field ${errors.city ? "error" : ""}`}>
                  <label htmlFor="pj-city">City</label>
                  <select id="pj-city" className="select" value={job.city} onChange={set("city")}>
                    <option value="">Select a city…</option>
                    {cities.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  {err("city")}
                </div>
                <div className="field">
                  <label htmlFor="pj-level">Experience level</label>
                  <select id="pj-level" className="select" value={job.level} onChange={set("level")}>
                    {levels.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className={`field ${errors.salary ? "error" : ""}`}>
                <label>Monthly salary (USD) <small>Optional — jobs with salary get 2× more applicants</small></label>
                <div className="grid-2">
                  <input className="input" inputMode="numeric" placeholder="Min, e.g. 800" value={job.min} onChange={(e) => setjob({ ...job, min: e.target.value.replace(/\D/g, "") })} />
                  <input className="input" inputMode="numeric" placeholder="Max, e.g. 1200" value={job.max} onChange={(e) => setjob({ ...job, max: e.target.value.replace(/\D/g, "") })} />
                </div>
                {err("salary")}
              </div>
            </div>

            <div className="form-section">
              <h3>Details</h3>
              <p>Be specific — clear posts attract better candidates.</p>
              <div className={`field ${errors.description ? "error" : ""}`}>
                <label htmlFor="pj-desc">Job description <small>{job.description.length}/600</small></label>
                <textarea id="pj-desc" className="textarea" maxLength={600} value={job.description} onChange={set("description")} placeholder="What the team does, what this person will own and why it’s exciting…" />
                {err("description")}
              </div>
              <div className="grid-2">
                <div className="field">
                  <label htmlFor="pj-resp">Responsibilities <small>One per line</small></label>
                  <textarea id="pj-resp" className="textarea" value={job.responsibilities} onChange={set("responsibilities")} placeholder={"Build new features\nReview pull requests"} />
                </div>
                <div className="field">
                  <label htmlFor="pj-req">Requirements <small>One per line</small></label>
                  <textarea id="pj-req" className="textarea" value={job.requirements} onChange={set("requirements")} placeholder={"2+ years experience\nGood English"} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="pj-skill">Skills <small>Press Enter to add · up to 8</small></label>
                <div className="tags-input">
                  {job.skills.map((s) => (
                    <span key={s} className="skill">{s}<button type="button" aria-label={`Remove ${s}`} onClick={() => setjob({ ...job, skills: job.skills.filter((x) => x !== s) })}><Close /></button></span>
                  ))}
                  <input id="pj-skill" value={skill} onChange={(e) => setSkill(e.target.value)} onKeyDown={addSkill} placeholder={job.skills.length ? "" : "React, Figma, SQL…"} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="pj-img">Company logo URL <small>Optional</small></label>
                <input id="pj-img" className="input" type="url" value={job.image} onChange={set("image")} placeholder="https://…/logo.png" />
              </div>
            </div>

            <div className="row" style={{ marginTop: 24, justifyContent: "flex-end" }}>
              <button type="button" className="btn btn-ghost" onClick={() => setjob(empty)}>Reset</button>
              <button className="btn btn-primary btn-lg">Publish job <Arrow /></button>
            </div>
          </form>

          <div className="preview">
            <div className="preview-label"><span className="live" /> Live preview</div>
            <Jobitem job={preview} onSelect={() => {}} />
            <div className="tip">
              <strong><Spark width={15} style={{ verticalAlign: -2 }} /> Tip</strong>
              Add 3–5 skills and a salary range — they’re the first things candidates filter by.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
