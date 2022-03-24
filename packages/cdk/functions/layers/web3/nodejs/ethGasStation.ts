import fetch from "node-fetch";

interface Result {
  safeLow: number;
  standard: number;
  fast: number;
  fastest: number;
  blockTime: number;
  blockNumber: number;
}
export const ethGasStationCall = async (): Promise<Result | null> => {
  try {
    return (await (
      await fetch("https://gasstation-mainnet.matic.network")
    ).json()) as Result;
  } catch (e) {
    return null;
  }
};

export const getFastestGas = async (): Promise<number | null> => {
  const r = await ethGasStationCall();
  if (r) {
    return r?.fastest;
  } else {
    return null;
  }
};
