"use client";

import { useEffect, useState } from "react";
import { format, toZonedTime } from "date-fns-tz";

interface LocalDateProps {
  isoString: string;
}

export default function DateInUserTimezone({ isoString }: LocalDateProps) {
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const zonedDate = toZonedTime(isoString, userTimeZone);

    const result = format(zonedDate, "MMM dd, yyyy h:mm a", {
      timeZone: userTimeZone,
    });

    setFormattedDate(result);
  }, [isoString]);

  if (!formattedDate) {
    return <span className="animate-pulse text-gray-400">Loading date...</span>;
  }

  return <span>{formattedDate}</span>;
}
