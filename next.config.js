/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')([
  '@cloudinary/base',
  '@cloudinary/html',
  '@cloudinary/react',
])

module.exports = withTM({
  reactStrictMode: true,
})
