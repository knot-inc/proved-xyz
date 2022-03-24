import { Input } from ".";

// Date displayed in MM/DD/YYYY format, but recorded as YYYY-MM-DD
const regex = /^\d{4}-\d{2}-\d{2}$/;
const month = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

const day = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
];

const validateDate = (name: string, date: string) => {
  const result = regex.test(date);
  if (!result)
    return { error: `${name} should be in YYYY-MM-DD format`, valid: false };
  const d = date.split("-");
  const isMonth = month.includes(d[1]);
  if (!isMonth) {
    return { error: "Invalid Month", valid: false };
  }
  const isDate = day.includes(d[2]);
  if (!isDate) {
    return { error: "Invalid Date", valid: false };
  }

  return null;
};
export const validateInput = (
  input: Input
): { error?: string; valid: boolean } => {
  // TODO: do better check. Currently it has a dependency with org value
  if (input.org.name === "Select") {
    return { error: "Org is not selected", valid: false };
  }
  if (input.startDate) {
    const result = validateDate("startDate", input.startDate);
    if (result) return result;
  }
  if (input.endDate) {
    const result = validateDate("endDate", input.endDate);
    if (result) return result;
  }
  return { valid: true };
};
