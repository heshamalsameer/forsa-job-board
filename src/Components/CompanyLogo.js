import React, { useState } from "react";
import { colorFor, initials } from "./utils";

export const CompanyLogo = ({ job, size = "" }) => {
  const [failed, setFailed] = useState(false);
  const bg = job.color || colorFor(job.company);
  return (
    <span className={`logo-box ${size}`} style={{ background: bg }} aria-hidden>
      {job.image && !failed ? <img src={job.image} alt="" onError={() => setFailed(true)} /> : initials(job.company)}
    </span>
  );
};
