import Head from "next/head";

export const Seo = ({
  imgHeight = 640,
  imgUrl,
  imgWidth = 1280,
  pageDescription,
  path,
  title,
}: {
  imgHeight: number;
  imgUrl: string;
  imgWidth: number;
  pageDescription: string;
  path: string;
  title: string;
}) => {
  const defaultDescription = "";

  const description = pageDescription ? pageDescription : defaultDescription;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:url" content={path} />
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={imgUrl} />
      <meta property="og:image:width" content={String(imgWidth)} />
      <meta property="og:image:height" content={String(imgHeight)} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@proved_xyz" />
      <meta name="twitter:url" content={path} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={
          imgUrl === "/proved-ogp.jpeg"
            ? "https://www.assetproved.com/contents/proved-ogp.jpeg"
            : imgUrl
        }
      />
      <meta name="twitter:image:alt" content="image" />
      <link rel="canonical" href={path} />
      {/** favicon */}
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link rel="icon" type="image/svg" sizes="32x32" href="/favicon.svg" />
      <link rel="icon" type="image/svg" sizes="16x16" href="/favicon.svg" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#7331FF" />
      <meta name="msapplication-TileColor" content="#7331FF" />
      <meta name="theme-color" content="#ffffff" />
    </Head>
  );
};
