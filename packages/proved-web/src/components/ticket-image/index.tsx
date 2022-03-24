import { useRouter } from "next/router";
import Head from "next/head";
import TicketVisual from "../ticket-visual";
import styles from "./ticket-image.module.css";
import { S3Object } from "API";

export default function TicketImage() {
  const { query } = useRouter();
  const profileImage: S3Object = {
    __typename: "S3Object",
    bucket: query.bucket as string,
    key: `public/avatar/${query.wallet}.png`,
    region: "us-west-2",
  };
  return (
    <div className={styles.background}>
      <div className={styles.page}>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link
            href="https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap"
            rel="stylesheet"
          />
        </Head>
        <TicketVisual
          walletname={query.wallet ? query.wallet.toString() : undefined}
          name={query.name ? query.name?.toString() : undefined}
          orgname={query.orgname ? query.orgname?.toString() : undefined}
          role={query.role ? query.role?.toString() : undefined}
          prover={query.prover ? query.prover?.toString() : undefined}
          profileImage={profileImage}
        />
      </div>
    </div>
  );
}
