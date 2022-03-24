import { ethers } from "/opt/nodejs/ethers-utils";
export const validateSign = ({
  address,
  signature,
  nonce,
}: {
  address: string;
  signature: string;
  nonce: string;
}): boolean => {
  const message = `Proved nonce ${nonce}`;
  const hash = ethers.utils.hashMessage(message);

  const signedAddress = ethers.utils.recoverAddress(hash, signature);
  return signedAddress.toLowerCase() === address.toLowerCase();
};
