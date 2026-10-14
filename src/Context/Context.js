import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { reduser } from "./reduser";
import { jobs, demoUsers, demoApplications } from "./initial";
import { Action_Types as actions } from "./ActionsTypes";

const KEY = "forsa-state-v1";

const load = () => {
  const base = { jobs, users: demoUsers, employees: demoApplications, saved: {}, session: null };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...base, ...JSON.parse(raw) };
  } catch {
  }
  return base;
};

export const GlobalContext = createContext(null);

export const Context = ({ children }) => {
  const [state, dispatch] = useReducer(reduser, undefined, load);
  const [toasts, setToasts] = useState([]);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("forsa-theme") || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("forsa-theme", theme);
    } catch {
    }
  }, [theme]);

  const notify = useCallback((text, tone = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const value = useMemo(() => {
    const user = state.users.find((u) => u.email === state.session) || null;
    const saved = user ? state.saved[user.email] || [] : [];
    return {
      ...state,
      dispatch,
      user,
      login: !!user,
      loginby: user?.loginby || "employee",
      savedIds: saved,
      toasts,
      notify,
      theme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      toggleSaved: (id) => user && dispatch({ type: actions.TOGGLE_SAVED, email: user.email, id }),
      applicationsFor: (jobId) => state.employees.filter((a) => a.id === jobId),
      hasApplied: (jobId) => !!user && state.employees.some((a) => a.id === jobId && a.email === user.email),
    };
  }, [state, toasts, notify, theme]);

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};

export const useJobs = () => useContext(GlobalContext);
