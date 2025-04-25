/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '/ui',
    output: 'standalone',
    transpilePackages: ['react-md-editor'],
};

module.exports = nextConfig;
