export const formatDate = (date?: string | null) => {
  if (!date) return "";
  const d = new Date(date);
  const m = d.getUTCMonth() + 1;
  const month = m > 9 ? m : `0${m}`;
  return `${month} / ${d.getUTCFullYear()}`;
};
