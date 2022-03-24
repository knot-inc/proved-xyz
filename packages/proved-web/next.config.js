/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "provedcdkstack-dev-s3s3imagebucket90afec10-530s8rgn9kbj.s3.us-west-2.amazonaws.com",
      "provedcdkstack-prod-s3s3imagebucket90afec10-6q2ghngd7p0l.s3.us-west-2.amazonaws.com",
      "proved.xyz",
      "assetproved.com",
      "cdn.discordapp.com",
    ],
    formats: ["image/avif", "image/webp"],
  },
};
