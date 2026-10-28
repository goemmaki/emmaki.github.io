"use client";

import { useEffect, useState } from "react";
import { WORK_HOURS } from "@/lib/content";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// The owner's local time and whether it's working hours there, e.g. "14:32 EEST ONLINE": the time and
// zone (EET, EEST in summer) in Geist medium, the status in capitals in Geist's thinnest weight, all
// in full ink (never colored). Rendered after mount only: a static page can't know
// the time.
export function LocalClock({ className }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const timer = setInterval(tick, 15_000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return null;

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: WORK_HOURS.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZoneName: "shortOffset",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)!.value;
  const day = WEEKDAYS.indexOf(part("weekday"));
  const hour = Number(part("hour"));
  const online = WORK_HOURS.days.includes(day) && hour >= WORK_HOURS.start && hour < WORK_HOURS.end;
  // Athens is GMT+2 in winter (EET) and GMT+3 in summer (EEST).
  const zone = part("timeZoneName") === "GMT+3" ? "EEST" : "EET";

  return (
    <span className={cn("items-baseline gap-1.5 whitespace-nowrap font-heading text-sm", className)}>
      <span className="font-medium text-fg-max">
        <span className="tabular-nums">
          {part("hour")}:{part("minute")}
        </span>{" "}
        {zone}
      </span>
      <span className="font-thin uppercase text-fg-max">
        {online ? "Online" : "Offline"}
      </span>
    </span>
  );
}
