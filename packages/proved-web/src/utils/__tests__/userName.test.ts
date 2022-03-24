import { shortenName } from "utils/userName";

describe("shortenName", () => {
  it("should return default name", () => {
    expect(shortenName("0x3B49E514485d9A6D26E40A15a279110cfe7b0D95")).toBe(
      "0x3B...D95"
    );
  });
  it("should return name", () => {
    expect(shortenName("John")).toBe("John");
  });
  it("should return unknownname", () => {
    expect(shortenName(undefined)).toBe("Unknown User");
  });
});
