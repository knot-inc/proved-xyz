export interface StepEvent {
  address: string;
  nftTxHash?: string;
  proofId: string;
  s3Key?: string;
  txHash?: string;
  Status?: number;
  Message?: string;
  proofClaimNonce?: number;
  powNonce?: number;
}

export interface StepInput {
  address: string;
  proofId: string;
}
