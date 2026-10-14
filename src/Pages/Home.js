import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "../Components/Layout";
import { Jobitem } from "../Components/Jobitem";
import { JobDetail } from "../Components/JobDetail";
import { GetJob } from "../Components/GetJob";
import { Filter, emptyFilters } from "../Components/Filter";
import { Drawer } from "../Components/Modal";
import { useJobs } from "../Context/Context";
import { cities } from "../Context/initial";
import { Briefcase, Close, Filter as FilterIc, Pin, Search } from "../Components/Icons";

const popular = ["Frontend", "Backend", "Designer", "Flutter", "Remote"];

const useWide = (q = "(min-width: 1181px)") => {
  const [wide, setWide] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setWide(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, [q]);
  return wide;
};

export const Home = () => {
  const ctx = useJobs();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [city, setCity] = useState("");
  const [hour, setHour] = useState("");
  const [filters, setFilters] = useState(emptyFilters);
  const [sort, setSort] = useState("new");
  const [applyTo, setApplyTo] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const wide = useWide();

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    const out = ctx.jobs.filter((j) => {
      if (term && !`${j.name} ${j.company} ${j.skills?.join(" ")} ${j.mode} ${j.city}`.toLowerCase().includes(term)) return false;
      if (city && j.city !== city) return false;
      if (hour && j.hour !== hour) return false;
      if (filters.hour.length && !filters.hour.includes(j.hour)) return false;
      if (filters.mode.length && !filters.mode.includes(j.mode)) return false;
      if (filters.level.length && !filters.level.includes(j.level)) return false;
      if (filters.city.length && !filters.city.includes(j.city)) return false;
      if (filters.minSalary && (j.salary?.[1] || 0) < filters.minSalary) return false;
      return true;
    });
    if (sort === "new") out.sort((a, b) => b.postedAt - a.postedAt);
    if (sort === "salary") out.sort((a, b) => (b.salary?.[1] || 0) - (a.salary?.[1] || 0));
    return out;
  }, [ctx.jobs, q, city, hour, filters, sort]);

  const selectedId = params.get("job");
  const selected = list.find((j) => j.id === selectedId) || (wide ? list[0] : null);

  const select = (id) => {
    const next = new URLSearchParams(params);
    next.set("job", id);
    setParams(next, { replace: true });
    if (!wide) setDrawer(true);
  };

  const needLogin = () => {
    ctx.notify("Sign in to apply and save jobs", "warn");
    navigate(`/signin?next=${encodeURIComponent(`/?job=${selected?.id || ""}`)}`);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const chips = [
    ...filters.hour.map((v) => ["hour", v]), ...filters.mode.map((v) => ["mode", v]),
    ...filters.level.map((v) => ["level", v]), ...filters.city.map((v) => ["city", v]),
  ];
  const companies = new Set(ctx.jobs.map((j) => j.company)).size;
  const remote = ctx.jobs.filter((j) => j.mode === "Remote").length;

  const submit = (e) => {
    e.preventDefault();
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Layout>
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <span className="eyebrow"><b>NEW</b> {list.length} open roles across Syria</span>
              <h1>
                Find work you’ll
                <br />
                <span className="rotator serif"><span>love.</span><span>grow in.</span><span>be proud of.</span></span>
              </h1>
              <p className="lead">No noise, no endless forms. Search jobs, apply in three quick steps and track every application. Companies post roles and review applicants in one clean dashboard.</p>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><strong>{ctx.jobs.length}</strong><span>Open jobs</span></div>
              <div className="hero-stat"><strong>{companies}</strong><span>Companies</span></div>
              <div className="hero-stat"><strong>{remote}</strong><span>Remote roles</span></div>
            </div>
          </div>

          <form className="searchbar" onSubmit={submit} role="search">
            <label className="sfield">
              <Search />
              <span className="sr-only">Job title or keyword</span>
              <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Job title, skill or company" />
              {q ? <button type="button" className="save-btn" aria-label="Clear" onClick={() => setQ("")}><Close /></button> : <span className="kbd">/</span>}
            </label>
            <label className="sfield">
              <Pin />
              <span className="sr-only">City</span>
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">All cities</option>
                {cities.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="sfield">
              <Briefcase />
              <span className="sr-only">Job type</span>
              <select value={hour} onChange={(e) => setHour(e.target.value)}>
                <option value="">Any job type</option>
                <option>Full time</option>
                <option>Part time</option>
              </select>
            </label>
            <button className="btn btn-primary btn-lg" type="submit"><Search /> Search</button>
          </form>
          <div className="popular">
            <span className="muted">Popular:</span>
            {popular.map((p) => <button key={p} type="button" onClick={() => setQ(p)}>{p}</button>)}
          </div>
        </div>
      </section>

      <div className="container board" ref={listRef} style={{ scrollMarginTop: 80 }}>
        <Filter filters={filters} setFilters={setFilters} jobs={ctx.jobs} open={showFilters} />

        <section aria-label="Job results">
          <div className="list-head">
            <h2>{list.length} {list.length === 1 ? "job" : "jobs"} {q && <span className="muted" style={{ fontWeight: 500 }}>for “{q}”</span>}</h2>
            <div className="row">
              <button className="btn btn-sm show-filters" onClick={() => setShowFilters((s) => !s)}><FilterIc /> Filters{chips.length ? ` (${chips.length})` : ""}</button>
              <select className="select-sm" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort jobs">
                <option value="new">Newest first</option>
                <option value="salary">Highest salary</option>
              </select>
            </div>
          </div>
          {chips.length > 0 && (
            <div className="active-filters">
              {chips.map(([k, v]) => (
                <button key={k + v} onClick={() => setFilters({ ...filters, [k]: filters[k].filter((x) => x !== v) })}>{v} <Close /></button>
              ))}
            </div>
          )}
          {list.length === 0 ? (
            <div className="panel empty">
              <div className="ic"><Search /></div>
              <h3>No jobs match your search</h3>
              <p>Try a different keyword or remove some filters to see more opportunities.</p>
              <button className="btn" onClick={() => { setQ(""); setCity(""); setHour(""); setFilters(emptyFilters); }}>Reset search</button>
            </div>
          ) : (
            <div className="jobs">
              {list.map((job, i) => (
                <Jobitem key={job.id} job={job} index={i} selected={wide && selected?.id === job.id} onSelect={select} onNeedLogin={needLogin} />
              ))}
            </div>
          )}
        </section>

        <div className="detail-col">
          {selected && (
            <div className="panel detail">
              <JobDetail job={selected} onApply={setApplyTo} onNeedLogin={needLogin} />
            </div>
          )}
        </div>
      </div>

      {!wide && (
        <Drawer open={drawer && !!selected} onClose={() => setDrawer(false)} header={<strong>Job details</strong>}>
          <div style={{ margin: "-16px -22px" }}>
            <JobDetail job={selected} onApply={setApplyTo} onNeedLogin={needLogin} />
          </div>
        </Drawer>
      )}

      <GetJob job={applyTo} onClose={() => setApplyTo(null)} />
    </Layout>
  );
};
