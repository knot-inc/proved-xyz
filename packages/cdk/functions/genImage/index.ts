import * as AWS from "aws-sdk";
import screenshot from "./screenshot";
import { generateMetadata } from "./metadata";
import { proofGet, userGet } from "/opt/nodejs/dynamodb-utils";
import { StepEvent } from "@/stepTypes";

const { PROOF_TABLE_NAME, USER_TABLE_NAME } = process.env;

const s3 = new AWS.S3();

const shortenAddress = (name: string | undefined) => {
  if (!name) return "Unknown Address";
  // name is not updated
  if (name.startsWith("0x")) {
    return `${name.substring(0, 4)}...${name.substring(
      name.length - 3,
      name.length
    )}`;
  }
  return name;
};
export const handler = async function (event: StepEvent): Promise<StepEvent> {
  const address = event.address;
  const proofId = event.proofId;
  const status = event.Status;
  console.log("===== ", { address, status });
  if (status === 0) {
    return {
      address: "x",
      proofId,
      Message: `previous function failed`,
      Status: 0,
    };
  }
  if (!address) {
    return {
      address: "x",
      proofId,
      Message: `no address`,
      Status: 0,
    };
  }
  try {
    const proof = await proofGet(proofId as string, PROOF_TABLE_NAME as string);
    const user = await userGet(address, USER_TABLE_NAME as string);
    const prover = proof.provers![0];

    const url = `${
      process.env.SITE_URL
    }/ticket-image?walletname=${shortenAddress(address)}&name=${
      user.name
    }&orgname=${proof.org?.name}&prover=${prover?.name}(${shortenAddress(
      prover?.id
    )})&role=${proof.role}&bucket=${
      user.profileImage?.bucket
    }&wallet=${address}`;
    console.log("=====", url);
    const file = (await screenshot(url)) as Buffer;

    const imagePath = `public/nft-image/${address}/${proofId}.png`;
    const result = await s3
      .upload({
        Bucket: process.env.BUCKET as string,
        Body: file,
        Key: imagePath,
      })
      .promise();
    const txHash = event.txHash;

    const imageUrl = `${process.env.BUCKET_URL}/${result.Key}`;
    //generate content json
    const metadata = generateMetadata({
      imageUrl,
      name: `${user.name}(${shortenAddress(user.id)})`,
      orgName: proof.org?.name || "",
      txHash: `${process.env.TX_URL}/${txHash}`,
      prover_address: prover?.id!,
      prover_name: prover?.name!,
      role: proof.role || "",
      startDate: new Date(proof.startDate || "").toDateString(),
    });

    const metaPath = `public/proved/${proofId}`;
    const meta = await s3
      .upload({
        Bucket: process.env.BUCKET as string,
        Body: JSON.stringify(metadata),
        Key: metaPath,
        ContentType: "application/json",
      })
      .promise();

    return {
      ...event,
      s3Key: meta.Key,
      Message: `Success`,
      Status: 1,
    };
  } catch (e) {
    return {
      ...event,
      Message: `Failed to mint ${e}`,
      Status: 0,
    };
  }
};
