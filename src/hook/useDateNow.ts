import { useEffect, useState } from "react";

export default function useDateNow() {
  const [now, setNow] = useState<Date>();

  useEffect(() => {
    setNow(new Date());
  }, []);

  return now;
}
