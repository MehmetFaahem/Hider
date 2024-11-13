
import withPWA from 'next-pwa'

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,

async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
  
}

export default withPWA({
  dest: 'public', // destination directory for the PWA files
  disable:
    !process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY ||
    !process.env.WEB_PUSH_PRIVATE_KEY,
  register: true, // register the PWA service worker
  skipWaiting: true, // skip waiting for service worker activation
  buildExcludes: [/app-build-manifest\.json$/], // Exclude files from precaching
  // @ts-ignore
})(config)

