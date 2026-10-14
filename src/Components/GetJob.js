import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useJobs } from "../Context/Context";
import { Action_Types as actions } from "../Context/ActionsTypes";
import { Modal } from "./Modal";
import { CompanyLogo } from "./CompanyLogo";
import { Arrow, Back, Check, Close, Upload } from "./Icons";
import { emailOk } from "./utils";

const labels = ["Your details", "Resume", "Review"];

export const GetJob = ({ job, onClose }) => {
  const ctx = useJobs();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [drag, setDrag] = useState(false);
  const [errors, setErrors] = useState({});
  const [user, setuser] = useState({ name: "", email: "", phone: "", file: "", note: "" });

  useEffect(() => {
    if (job) {
      setStep(0);
      setDone(false);
      setErrors({});
      setuser({ name: ctx.user?.name || "", email: ctx.user?.email || "", phone: ctx.user?.phone || "", file: "", note: "" });
    }
  }, [job, ctx.user]);

  const set = (k) => (e) => setuser((u) => ({ ...u, [k]: e.target.value }));
  const pickFile = (f) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return setErrors({ file: "Max file size is 5 MB" });
    setErrors({});
    setuser((u) => ({ ...u, file: f.name, size: f.size }));
    return undefined;
  };

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!user.name.trim()) e.name = "Please enter your full name";
      if (!emailOk(user.email)) e.email = "Enter a valid email address";
      if (!/^[+\d][\d\s-]{6,}$/.test(user.phone.trim())) e.phone = "Enter a valid phone number";
    }
    if (step === 1 && !user.file) e.file = "Please attach your CV";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => {
    if (!validate()) return;
    if (step < 2) return setStep(step + 1);
    ctx.dispatch({
      type: actions.ADD_NEW_EMPLOYEE,
      employee: { appId: `a${Date.now()}`, id: job.id, name: user.name.trim(), email: user.email.trim(), phone: user.phone.trim(), file: user.file, note: user.note.trim(), status: "new", at: Date.now() },
    });
    setDone(true);
    return undefined;
  };

  const field = (k, label, props = {}) => (
    <div className={`field ${errors[k] ? "error" : ""}`}>
      <label htmlFor={`ap-${k}`}>{label}</label>
      <input id={`ap-${k}`} className="input" value={user[k]} onChange={set(k)} {...props} />
      {errors[k] && <span className="err">{errors[k]}</span>}
    </div>
  );

  if (!job) return null;

  return (
    <Modal
      open={!!job}
      onClose={onClose}
      title={done ? null : `Apply to ${job.company}`}
      subtitle={done ? null : job.name}
      icon={done ? null : <CompanyLogo job={job} />}
      footer={
        done ? (
          <>
            <Link to="/applications" className="btn" onClick={onClose}>Track application</Link>
            <button className="btn btn-primary" onClick={onClose}>Keep browsing</button>
          </>
        ) : (
          <>
            {step > 0 && <button className="btn btn-ghost" onClick={() => setStep(step - 1)}><Back /> Back</button>}
            <div className="spacer" />
            <button className="btn btn-primary" onClick={next}>{step === 2 ? "Submit application" : "Continue"} {step < 2 && <Arrow />}</button>
          </>
        )
      }
    >
      {done ? (
        <div className="success">
          <div className="ring"><Check /></div>
          <h3 style={{ fontSize: 22 }}>Application sent!</h3>
          <p className="muted" style={{ marginTop: 8 }}>
            {job.company} has received your application for <strong style={{ color: "var(--ink)" }}>{job.name}</strong>. You’ll see status updates in “My applications”.
          </p>
        </div>
      ) : (
        <>
          <div className="steps" aria-hidden>{labels.map((l, i) => <i key={l} className={i <= step ? "on" : ""} />)}</div>
          <div className="step-label">Step {step + 1} of 3 · {labels[step]}</div>
          <div className="modal-body" key={step} style={{ animation: "fade .3s" }}>
            {step === 0 && (
              <>
                {field("name", "Full name", { autoComplete: "name", autoFocus: true })}
                <div className="grid-2">
                  {field("email", "Email", { type: "email", autoComplete: "email" })}
                  {field("phone", "Phone", { type: "tel", autoComplete: "tel", placeholder: "09xx xxx xxx" })}
                </div>
              </>
            )}
            {step === 1 && (
              <>
                <div className={`field ${errors.file ? "error" : ""}`}>
                  <label>CV / Resume <small>PDF or DOC, max 5 MB</small></label>
                  {user.file ? (
                    <div className="file-chip">
                      <span className="fi">{user.file.split(".").pop().toUpperCase().slice(0, 4)}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.file}</strong>
                        <span className="muted" style={{ fontSize: 12.5 }}>{user.size ? `${Math.max(1, Math.round(user.size / 1024))} KB · ` : ""}Ready to send</span>
                      </div>
                      <button className="icon-btn" aria-label="Remove file" onClick={() => setuser((u) => ({ ...u, file: "" }))}><Close /></button>
                    </div>
                  ) : (
                    <label
                      className={`dropzone ${drag ? "drag" : ""}`}
                      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                      onDragLeave={() => setDrag(false)}
                      onDrop={(e) => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files[0]); }}
                    >
                      <Upload />
                      <strong>Drop your CV here or click to browse</strong>
                      <span className="muted" style={{ fontSize: 13 }}>We only keep the file name in this demo</span>
                      <input type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={(e) => pickFile(e.target.files[0])} />
                    </label>
                  )}
                  {errors.file && <span className="err">{errors.file}</span>}
                </div>
                <div className="field">
                  <label htmlFor="ap-note">Note to the hiring team <small>Optional</small></label>
                  <textarea id="ap-note" className="textarea" value={user.note} onChange={set("note")} maxLength={400} placeholder="A sentence or two about why you’re a great fit…" />
                  <span className="hint" style={{ textAlign: "right" }}>{user.note.length}/400</span>
                </div>
              </>
            )}
            {step === 2 && (
              <div className="review">
                <div><span>Position</span><strong>{job.name} · {job.company}</strong></div>
                <div><span>Name</span><strong>{user.name}</strong></div>
                <div><span>Email</span><strong>{user.email}</strong></div>
                <div><span>Phone</span><strong>{user.phone}</strong></div>
                <div><span>CV</span><strong>{user.file}</strong></div>
                {user.note && <div><span>Note</span><strong>{user.note}</strong></div>}
              </div>
            )}
          </div>
        </>
      )}
    </Modal>
  );
};
