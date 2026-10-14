import React from "react";
import { Modal } from "./Modal";
import { File, Mail, Phone } from "./Icons";
import { colorFor, initials, timeAgo } from "./utils";

export const statusTone = { new: "blue", shortlisted: "green", rejected: "red" };
export const statusLabel = { new: "New", shortlisted: "Shortlisted", rejected: "Not selected" };

export const Employeeinfo = ({ employee, job, onClose, onStatus }) => {
  if (!employee) return null;
  return (
    <Modal
      open={!!employee}
      onClose={onClose}
      title={employee.name}
      subtitle={`Applied to ${job?.name || "a job"} · ${timeAgo(employee.at)}`}
      icon={<span className="avatar" style={{ background: colorFor(employee.name) }}>{initials(employee.name)}</span>}
      footer={
        <>
          <button className="btn btn-danger" onClick={() => onStatus("rejected")}>Not a fit</button>
          <div className="spacer" />
          <a className="btn" href={`mailto:${employee.email}?subject=${encodeURIComponent(`Your application: ${job?.name || ""}`)}`}><Mail /> Email</a>
          <button className="btn btn-primary" onClick={() => onStatus("shortlisted")}>Shortlist</button>
        </>
      }
    >
      <div className="modal-body">
        <div className="review">
          <div><span>Application №</span><strong>{employee.appId}</strong></div>
          <div><span><Mail width={14} style={{ verticalAlign: -2 }} /> Email</span><strong><a href={`mailto:${employee.email}`}>{employee.email}</a></strong></div>
          <div><span><Phone width={14} style={{ verticalAlign: -2 }} /> Mobile</span><strong><a href={`tel:${employee.phone}`}>{employee.phone}</a></strong></div>
          <div><span><File width={14} style={{ verticalAlign: -2 }} /> CV</span><strong>{employee.file || "—"}</strong></div>
          <div><span>Status</span><strong><span className={`badge ${statusTone[employee.status]}`}>{statusLabel[employee.status]}</span></strong></div>
        </div>
        {employee.note && (
          <div style={{ marginTop: 14 }}>
            <div className="muted" style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Note from applicant</div>
            <p style={{ background: "var(--surface-2)", padding: 14, borderRadius: 12 }}>{employee.note}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};
