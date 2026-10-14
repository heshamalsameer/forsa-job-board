import React from "react";
import { Header } from "./Header";
import { useJobs } from "../Context/Context";
import { CheckCircle, Close } from "./Icons";

const Toasts = () => {
  const { toasts } = useJobs();
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.tone}`}>{t.tone === "warn" ? <Close /> : <CheckCircle />}{t.text}</div>
      ))}
    </div>
  );
};

export const Layout = ({ children, footer = true }) => (
  <div className="Layout">
    <Header />
    <main className="page">{children}</main>
    {footer && (
      <footer className="footer">
        <div className="container">
          <span>© {new Date().getFullYear()} Forsa — find your next opportunity.</span>
          <span>Demo app · data is stored in your browser</span>
        </div>
      </footer>
    )}
    <Toasts />
  </div>
);
