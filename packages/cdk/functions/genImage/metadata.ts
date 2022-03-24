export const generateMetadata = ({
  endDate,
  imageUrl,
  name,
  orgName,
  prover_address,
  prover_name,
  role,
  startDate,
  txHash,
}: {
  endDate?: string;
  imageUrl: string;
  name: string;
  orgName: string;
  prover_address: string;
  prover_name: string;
  role: string;
  startDate: string;
  txHash: string;
}) => {
  return {
    tags: ["proved"],
    name: `${orgName} - ${role}`,
    image_url: imageUrl,
    image: imageUrl,
    home_url: "",
    external_url: "",
    description: `This NFT from proved.xyz represents the proof of contribution of ${name} at ${orgName}. Proved by ${prover_name}`,
    attributes: [
      {
        value: startDate,
        trait_type: "startDate",
      },
      {
        value: endDate ?? "",
        trait_type: "endDate",
      },
      {
        value: prover_address,
        trait_type: "prover address",
      },
      {
        value: prover_name,
        trait_type: "prover name",
      },
      {
        value: txHash,
        trait_type: "proof tx hash",
      },
    ],
  };
};
