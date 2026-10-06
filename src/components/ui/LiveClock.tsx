import { useEffect, useState } from "react";
import { profile } from "@/data/content";

const format = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: profile.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d);

/** Local time in Casablanca, ticking every second. */
export function LiveClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState(() => format(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => setTime(format(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time className={`tabular ${className}`} aria-label={`Local time in Casablanca: ${time}`}>
      {time}
    </time>
  );
}
