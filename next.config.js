/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	transpilePackages: ['@uniswap/widgets', '@uniswap/conedison'],
	webpack: (config) => {
		config.resolve.fallback = { fs: false };
	
		return config;
	  },
};

module.exports = nextConfig;
