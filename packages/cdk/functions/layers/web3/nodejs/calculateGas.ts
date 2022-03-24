import { ethers } from "ethers";

export const calcMaxFeePerGas = ({
  fastestGasFee,
  tipRate = 0,
}: {
  fastestGasFee: number;
  tipRate?: number;
}): number => {
  if (tipRate > 100) throw new Error("tipRate should be less than 100");
  const gasFeeBN = ethers.utils.parseUnits(fastestGasFee.toString(), "gwei");
  const adjustedGasFee = gasFeeBN.mul(100 + tipRate).div(100);
  return Number(ethers.utils.formatUnits(adjustedGasFee, 0));
};
