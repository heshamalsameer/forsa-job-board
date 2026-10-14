import React from "react";
import { cities, hours, levels, modes } from "../Context/initial";

const Group = ({ title, options, value, onChange, counts }) => (
  <>
    <h4>{title}</h4>
    {options.map((o) => (
      <label key={o} className="check">
        <input type="checkbox" checked={value.includes(o)} onChange={() => onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o])} />
        {o}
        <small>{counts(o)}</small>
      </label>
    ))}
  </>
);

export const emptyFilters = { hour: [], mode: [], level: [], city: [], minSalary: 0 };

export const Filter = ({ filters, setFilters, jobs, open }) => {
  const set = (k) => (v) => setFilters({ ...filters, [k]: v });
  const count = (k) => (o) => jobs.filter((j) => j[k] === o).length;
  const dirty = Object.entries(filters).some(([, v]) => (Array.isArray(v) ? v.length : v));

  return (
    <aside className={`panel filters ${open ? "open" : ""}`} aria-label="Filters">
      <div className="filters-top">
        <strong>Filters</strong>
        {dirty && <button className="link-btn" onClick={() => setFilters(emptyFilters)}>Clear all</button>}
      </div>
      <Group title="Job type" options={hours} value={filters.hour} onChange={set("hour")} counts={count("hour")} />
      <Group title="Work mode" options={modes} value={filters.mode} onChange={set("mode")} counts={count("mode")} />
      <Group title="Experience" options={levels} value={filters.level} onChange={set("level")} counts={count("level")} />
      <h4>Minimum salary</h4>
      <input className="range" type="range" min="0" max="2000" step="100" value={filters.minSalary} onChange={(e) => set("minSalary")(+e.target.value)} aria-label="Minimum salary" />
      <div className="row" style={{ justifyContent: "space-between", fontSize: 13 }}>
        <span className="muted">Any</span>
        <strong>{filters.minSalary ? `$${filters.minSalary}+ / mo` : "Any"}</strong>
      </div>
      <Group title="City" options={cities} value={filters.city} onChange={set("city")} counts={count("city")} />
    </aside>
  );
};
