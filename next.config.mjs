/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // D:\ pe stray package-lock.json hai — workspace root lock karne ke liye
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
