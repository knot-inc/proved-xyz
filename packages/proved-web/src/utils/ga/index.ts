// log the pageview with their URL
export const pageview = (url: string) => {
  const page_title = url.split("/")[1] || "unknown";
  console.log(page_title);
  window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
    page_path: url,
    page_title,
  });
};

// log specific events happening.
export const event = ({
  action,
  params,
}: {
  action: unknown;
  params?: unknown;
}) => {
  window.gtag("event", action, params);
};
