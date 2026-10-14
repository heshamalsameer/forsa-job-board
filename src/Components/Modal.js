import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Close } from "./Icons";

const useEscape = (open, onClose) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
};

export const Modal = ({ open, onClose, title, subtitle, icon, children, footer, wide }) => {
  useEscape(open, onClose);
  if (!open) return null;
  return createPortal(
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? "wide" : ""}`} role="dialog" aria-modal="true" aria-label={title}>
        {title && (
          <div className="modal-head">
            {icon}
            <div style={{ flex: 1 }}>
              <h3>{title}</h3>
              {subtitle && <p className="muted" style={{ fontSize: 14, marginTop: 2 }}>{subtitle}</p>}
            </div>
            <button className="icon-btn" aria-label="Close" onClick={onClose}><Close /></button>
          </div>
        )}
        {children}
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

export const Drawer = ({ open, onClose, header, children }) => {
  useEscape(open, onClose);
  if (!open) return null;
  return createPortal(
    <>
      <div className="drawer-back" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true">
        <div className="drawer-head">
          <div style={{ flex: 1, minWidth: 0 }}>{header}</div>
          <button className="icon-btn" aria-label="Close" onClick={onClose}><Close /></button>
        </div>
        <div className="drawer-body">{children}</div>
      </aside>
    </>,
    document.body
  );
};
