import { Storage } from "aws-amplify";
import Image from "next/image";
import React, { useEffect, useState } from "react";

// TODO temporary type
// import type { S3ObjectInput } from "API";
export type S3ObjectInput = {
  bucket: string;
  key: string;
  region: string;
};

interface Props {
  alt: string;
  height: number;
  identityId?: string;
  object?: S3ObjectInput | null;
  width: number;
}

export const S3Photo = ({ alt, height, identityId, object, width }: Props) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const getUrl = async () => {
      if (!object?.key) {
        return;
      }
      // Amplify Storage uses level public as a directory name. A hack to remove it for now
      const excludedKey = object.key.replace("public/", "");
      const url = await Storage.get(excludedKey, {
        level: "public",
        bucket: object.bucket,
        region: object.region,
        identityId,
      });

      if (!mounted) {
        return;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setPhotoUrl(url);
    };
    getUrl();

    return () => {
      mounted = false;
    };
  }, [object, object?.key, object?.bucket, object?.region, identityId]);

  return (
    <>
      {photoUrl && (
        <Image alt={alt} src={photoUrl} height={height} width={width} />
      )}
    </>
  );
};
