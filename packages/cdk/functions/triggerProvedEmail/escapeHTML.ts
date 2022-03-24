const escapeChars: { [key: string]: string } = {
  "<": "lt",
  ">": "gt",
  '"': "quot",
  "'": "#39",
};

let regexString = "[";
for (const key in escapeChars) {
  regexString += key;
}
regexString += "]";

const regex = new RegExp(regexString, "g");

export const escapeHTML = (str: string) => {
  return str.replace(regex, (value) => `&${escapeChars[value]};`);
};
