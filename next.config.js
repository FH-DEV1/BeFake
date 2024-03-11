/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    output: "export"
}
const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
})

module.exports = withPWA(nextConfig)
