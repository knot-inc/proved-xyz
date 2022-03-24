import * as AWS from "aws-sdk";
const secretManager = new AWS.SecretsManager();
export const getSecret = async (SecretId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    secretManager.getSecretValue(
      {
        SecretId,
      },
      (err, data) => {
        if (err) {
          console.log(`secret failed ${err}`);
          reject(err);
          return;
        }
        // Decrypts secret using the associated KMS key.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if ("SecretString" in data) {
          const json = JSON.parse(data.SecretString as string);
          resolve(json.PK);
          return;
        }
        reject("No secret");
      }
    );
  });
};
