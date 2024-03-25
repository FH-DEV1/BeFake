/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        unoptimized: true,
        remotePatterns: [{
            protocol: 'https',
            hostname: '**.bereal.network',
            pathname: '/Photos/**',
        }],
    }
};

const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
})

module.exports = withPWA(nextConfig)
