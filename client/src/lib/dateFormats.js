export function formatDate(dateString) {
  if (!dateString) {
    return ""; // handle null/undefined/empty
  }

  // Normalize MySQL-style "YYYY-MM-DD HH:mm:ss" into ISO "YYYY-MM-DDTHH:mm:ssZ"
  let normalized = dateString;
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateString)) {
    normalized = dateString.replace(" ", "T") + "Z";
  }

  const date = new Date(normalized);

  if (isNaN(date.getTime())) {
    console.warn("Invalid date passed to formatDate:", dateString);
    return ""; // or "Invalid Date"
  }

  const options = {
    weekday: "long",   // Thursday
    month: "long",     // September
    year: "numeric",
    day:"numeric",  
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(date);


//   const weekday = parts.find(p => p.type === "weekday")?.value || "";
  const day = parts.find(p => p.type === "day")?.value || "";
  const month = parts.find(p => p.type === "month")?.value || "";
  const year = parts.find(p => p.type === "year")?.value || "";

  return `${day}, ${month}, ${year}`;
}
