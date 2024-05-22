export function formatDate(dateStr: string) {
  if (!dateStr) return "";
  let date = new Date(dateStr);
  return date.toLocaleString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function dateStatus(dateEpoch: number) {
  let now = Date.now();
  if (dateEpoch > now) return "Overdue";
  return `Due in ${Math.ceil((dateEpoch - now) / (1000 * 60 * 60 * 24))} days`;
}

export function msToTime(duration: number) {
  console.log(duration);
  const type = duration !== 0 ? (duration < 0 ? -1 : 1) : 0;
  duration = Math.abs(duration);
  let milliseconds = String(Math.floor((duration % 1000) / 100)).padStart(
    2,
    "0",
  );
  let seconds = String(Math.floor((duration / 1000) % 60)).padStart(2, "0");
  let minutes = String(Math.floor((duration / (1000 * 60)) % 60)).padStart(
    2,
    "0",
  );
  let hours = String(Math.floor((duration / (1000 * 60 * 60)) % 24)).padStart(
    2,
    "0",
  );
  let days = String(
    Math.floor((duration / (1000 * 60 * 60 * 24)) % 365),
  ).padStart(2, "0");

  return {
    type: type,
    val: `${days}d ${hours}h ${minutes}m`, // ${seconds}.${milliseconds}`,
  };
}
