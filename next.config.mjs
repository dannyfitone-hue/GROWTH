/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: {
    '/api/reports/**/*': ['./public/brand/growth-intelligence-llc-logo.png'],
    '/api/portal/**/*': ['./public/brand/growth-intelligence-llc-logo.png']
  },
  experimental: { serverActions: { bodySizeLimit: '8mb' } }
};
export default nextConfig;
