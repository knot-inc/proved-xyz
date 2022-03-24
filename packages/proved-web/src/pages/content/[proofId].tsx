import { Amplify } from "aws-amplify";
import { Layout } from "components/Layout";
import { Content } from "components/content";
import awsExports from "../../aws-exports";
import { Seo } from "components/ui/Seo";
import { GetServerSideProps } from "next";

// client-side credentials are passed to the server via cookies
Amplify.configure({ ...awsExports, ssr: true });

export const getServerSideProps: GetServerSideProps = async (context) => {
  const proofId = context.query?.proofId;
  if (!proofId) {
    return {
      props: {},
    };
  }
  const searchParams = new URLSearchParams();
  searchParams.set("proofId", proofId as string);
  try {
    const result = await (
      await fetch(
        `${process.env.NEXT_PUBLIC_OGP_API}/gen-nft-ogp?${searchParams}`,
        {
          method: "GET",
        }
      )
    ).json();
    return {
      props: {
        imageUrl: result.imageUrl,
      },
    };
  } catch (e) {
    console.log("===e", e);
    return {
      props: {},
    };
  }
};

interface Props {
  imageUrl?: string;
}

export default function ContentPage(props: Props) {
  return (
    <Layout>
      <Seo
        imgHeight={768}
        imgWidth={1024}
        imgUrl={props.imageUrl ? props.imageUrl : "/proved-ogp.jpeg"}
        path="https://proved.xyz"
        title="Proved"
        pageDescription="Prove your Discord roles with NFTs."
      />
      <Content />
    </Layout>
  );
}
