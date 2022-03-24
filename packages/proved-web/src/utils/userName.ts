export const shortenName = (name: string | undefined) => {
  if (!name) return "Unknown User";
  // name is not updated
  if (name.startsWith("0x")) {
    return `${name.substring(0, 4)}...${name.substring(
      name.length - 3,
      name.length
    )}`;
  }
  return name;
};
