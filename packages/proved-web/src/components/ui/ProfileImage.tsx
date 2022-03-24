import { S3Photo, S3ObjectInput } from "components/ui/S3Photo";
import { ImageSize } from "types";

const mapStyle = {
  [ImageSize.Size_12px]: "h-8 w-8",
  [ImageSize.Size_48px]: "h-12 w-12",
  [ImageSize.Size_64px]: "h-16 w-16",
};

export const ProfileImage = ({
  profileImage,
  size,
}: {
  profileImage: S3ObjectInput | null | undefined;
  size: ImageSize;
}) => {
  return (
    <>
      {profileImage ? (
        <div
          className={`rounded-full overflow-hidden bg-white ${mapStyle[size]}`}
        >
          <S3Photo
            width={size}
            height={size}
            object={profileImage}
            alt="profileImage"
          />
        </div>
      ) : (
        <span
          className={`inline-block ${mapStyle[size]} rounded-full overflow-hidden bg-gray-100`}
        >
          <svg
            className="h-full w-full text-gray-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </span>
      )}
    </>
  );
};
