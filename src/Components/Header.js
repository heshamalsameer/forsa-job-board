import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useJobs } from "../Context/Context";
import { Action_Types as actions } from "../Context/ActionsTypes";
import { Briefcase, Building, Close, Grid, Logout, Menu, Moon, Plus, Sun, User, Bookmark } from "./Icons";
import { colorFor, initials } from "./utils";

export const Logo = () => (
  <Link to="/" className="logo" aria-label="Forsa home">
    <span className="logo-mark"><Briefcase /></span>
    Forsa
  </Link>
);

export const Header = () => {
  const ctx = useJobs();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mobile, setMobile] = useState(false);
  const ref = useRef(null);
  const isCompany = ctx.user?.loginby === "company";
  const myApps = ctx.user ? ctx.employees.filter((a) => a.email === ctx.user.email).length : 0;
  const myJobs = ctx.user ? ctx.jobs.filter((j) => j.ownerEmail === ctx.user.email) : [];
  const incoming = ctx.employees.filter((a) => myJobs.some((j) => j.id === a.id) && a.status === "new").length;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menu) return undefined;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setMenu(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menu]);

  const logout = () => {
    ctx.dispatch({ type: actions.LOGOUT });
    ctx.notify("You’ve been signed out");
    setMenu(false);
    setMobile(false);
    navigate("/");
  };

  const links = [
    { to: "/", label: "Find jobs", end: true },
    ...(ctx.user && !isCompany ? [{ to: "/applications", label: "My applications", count: myApps }] : []),
    ...(isCompany ? [{ to: "/dashboard", label: "Dashboard", count: incoming }, { to: "/addnewjob", label: "Post a job" }] : []),
  ];

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="nav">
          <Logo />
          <nav className="links" aria-label="Main">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end}>
                {l.label}
                {!!l.count && <span className="count">{l.count}</span>}
              </NavLink>
            ))}
          </nav>
          <div className="spacer" />
          <button className="icon-btn" aria-label="Toggle dark mode" onClick={ctx.toggleTheme}>{ctx.theme === "dark" ? <Sun /> : <Moon />}</button>
          {ctx.user ? (
            <>
              {isCompany && <Link to="/addnewjob" className="btn btn-primary hide-sm"><Plus /> Post a job</Link>}
              <div className="user-menu hide-sm" ref={ref}>
                <button className="user-btn" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
                  <span className="avatar" style={{ background: colorFor(ctx.user.name) }}>{initials(ctx.user.name)}</span>
                  <span>{ctx.user.name.split(" ")[0]}</span>
                </button>
                {menu && (
                  <div className="dropdown">
                    <div className="who">
                      <strong>{ctx.user.name}</strong>
                      <div className="muted" style={{ fontSize: 13 }}>{ctx.user.email}</div>
                      <span className={`badge ${isCompany ? "blue" : "green"}`} style={{ marginTop: 8 }}>
                        {isCompany ? <Building /> : <User />} {isCompany ? "Company" : "Job seeker"}
                      </span>
                    </div>
                    {isCompany ? (
                      <>
                        <Link to="/dashboard" onClick={() => setMenu(false)}><Grid /> Dashboard</Link>
                        <Link to="/addnewjob" onClick={() => setMenu(false)}><Plus /> Post a job</Link>
                      </>
                    ) : (
                      <>
                        <Link to="/applications" onClick={() => setMenu(false)}><Briefcase /> My applications</Link>
                        <Link to="/applications?tab=saved" onClick={() => setMenu(false)}><Bookmark /> Saved jobs</Link>
                      </>
                    )}
                    <button onClick={logout}><Logout /> Sign out</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn btn-ghost hide-sm">Sign in</Link>
              <Link to="/signup" className="btn btn-primary hide-sm">Create account</Link>
            </>
          )}
          <button className="icon-btn burger" aria-label="Menu" aria-expanded={mobile} onClick={() => setMobile((m) => !m)}>{mobile ? <Close /> : <Menu />}</button>
        </div>
        {mobile && (
          <nav className="mobile-nav" aria-label="Mobile">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setMobile(false)}>{l.label}{!!l.count && <span className="badge green">{l.count}</span>}</NavLink>
            ))}
            {ctx.user ? (
              <button onClick={logout}><Logout width={18} /> Sign out ({ctx.user.name})</button>
            ) : (
              <>
                <NavLink to="/signin" onClick={() => setMobile(false)}>Sign in</NavLink>
                <NavLink to="/signup" onClick={() => setMobile(false)}>Create account</NavLink>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};
