import { Hub } from "aws-amplify";
import { useState } from "react";

export const useVerify = () => {
  const [error, setError] = useState<Error | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const verify = async ({
    address,
    code,
    path,
  }: {
    address: string;
    code: string;
    path: string;
  }) => {
    setLoading(true);
    const isLocal = window.location.hostname === "localhost";
    const body = JSON.stringify({
      address,
      code,
      isLocal,
      path,
    });
    try {
      const verifyResult = await (
        await fetch(`${process.env.NEXT_PUBLIC_AUTH_API}/verify`, {
          method: "POST",
          body,
        })
      ).json();
      Hub.dispatch("user", { event: "verify", data: { ...verifyResult } });
    } catch (e) {
      console.log("===== error", e);
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return [
    {
      error,
      loading,
    },
    verify,
  ] as const;
};
