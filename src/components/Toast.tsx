"use client";
import { useEffect } from "react";

export default function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [msg, onDone]);

  return (
    <div className="toast-slot">
      <div className="toast">{msg}</div>
    </div>
  );
}
