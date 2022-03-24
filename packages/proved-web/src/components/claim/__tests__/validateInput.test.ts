import { Org } from "API";
import { Input } from "..";
import { validateInput } from "../validateInput";

const defaultOrg: Org = {
  __typename: "Org",
  id: "default",
  name: "Select",
};

const testOrg: Org = {
  __typename: "Org",
  id: "default",
  name: "Test Org",
};
describe("validateInput", () => {
  it("should return valid if valid", () => {
    const input: Input = {
      org: testOrg,
      role: "role",
      startDate: "2020-11-25",
      endDate: "2023-01-13",
    };
    const result = validateInput(input);
    expect(result.valid).toBe(true);
  });
  it("should return invalid if endDate is not valid", () => {
    const input: Input = {
      org: testOrg,
      role: "role",
      startDate: "2020-11-12",
      endDate: "vsdfa",
    };
    const result = validateInput(input);
    expect(result.error).toBe("endDate should be in YYYY-MM-DD format");
    expect(result.valid).toBe(false);
  });
  it("should return invalid if startDate is not valid", () => {
    const input: Input = {
      org: testOrg,
      role: "role",
      startDate: "2020-13-12",
      endDate: "vsdfa",
    };
    const result = validateInput(input);
    expect(result.error).toBe("Invalid Month");
    expect(result.valid).toBe(false);
  });
  it("should return invalid if org is default", () => {
    const input: Input = {
      org: defaultOrg,
      role: "role",
      startDate: "2020-11-15",
    };
    const result = validateInput(input);
    expect(result.error).toBe("Org is not selected");
    expect(result.valid).toBe(false);
  });
});
