const nextConfig = {
    transpilePackages: ['@supabase/ssr', '@supabase/supabase-js'],
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
