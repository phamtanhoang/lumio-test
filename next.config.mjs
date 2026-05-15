/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // d3 submodules ship ESM-only; without transpile, Node SSR fails ERR_REQUIRE_ESM.
  transpilePackages: ["react-simple-maps", "d3-array", "d3-geo", "d3-scale"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "flagcdn.com" }],
  },
};

export default nextConfig;
