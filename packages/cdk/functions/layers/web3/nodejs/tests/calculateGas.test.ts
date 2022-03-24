import { calcMaxFeePerGas } from "../calculateGas";

describe("calcMaxFeePerGas", () => {
  it("should calculate bigNumber properly", () => {
    const num = calcMaxFeePerGas({ fastestGasFee: 64.1 });
    expect(num).toBe(64100000000);
  });
  it("should calculate bigNumber properly with tipRate", () => {
    const num = calcMaxFeePerGas({ fastestGasFee: 12.4, tipRate: 30 });
    expect(num).toBe(16120000000);
  });
  it("should throw error when tipRate is larger than 100", () => {
    expect(() =>
      calcMaxFeePerGas({ fastestGasFee: 12.4, tipRate: 101 })
    ).toThrowError("tipRate should be less than 100");
  });
});
