export default function truncateText(text = "", limit = 30, suffix = "…") {
  if (typeof text !== "string") return "";
  if (text.length <= limit) return text;

  return text.slice(0, limit).trimEnd() + suffix;
}