import React, { useEffect, useState } from "react";

export const Typewriter = ({ text, time = 30 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(0);
  }, [text]);
  useEffect(() => {
    if (count >= text.length) return undefined;
    const id = setTimeout(() => setCount((c) => c + 1), time);
    return () => clearTimeout(id);
  }, [count, text, time]);
  return (
    <span>
      {text.slice(0, count)}
      <span style={{ opacity: count < text.length ? 1 : 0, color: "var(--brand)" }}>▍</span>
    </span>
  );
};
