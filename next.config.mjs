import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

/** @type {import('next').NextConfig} */
const createNextConfig = (phase) => ({
  // Keep development and production artifacts isolated. Running `next build`
  // must never invalidate CSS and JS chunks served by an active dev server.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    CAN_EXPAND_PROJECTS: process.env.CAN_EXPAND_PROJECTS,
    DO_THUNDERBOLT_ANIM: process.env.DO_THUNDERBOLT_ANIM,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'aceternity.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'assets.aceternity.com' },
    ],
  },
});

export default createNextConfig;
