import { Stack } from "aws-cdk-lib";

export function deployEnv(): string {
  return process.env.DEPLOY_ENV || "dev";
}

export function envSpecific(logicalName: string | Stack): string {
  const logical =
    typeof logicalName === "string" ? logicalName : logicalName.stackName;

  return `${logical}-${deployEnv()}`;
}
