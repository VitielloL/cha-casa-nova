/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ['via.placeholder.com', 'images.unsplash.com'],
  },
  // Otimizações de performance para desenvolvimento
  experimental: {
    optimizeCss: false, // Desabilitado para desenvolvimento
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Otimizações de navegação
    scrollRestoration: true,
    // Prefetching otimizado
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    // Prevenção de flash durante navegação
    serverComponentsExternalPackages: [],
  },
  // Compressão desabilitada para desenvolvimento
  compress: false,
  // Configuração de fontes
  optimizeFonts: false, // Desabilitado para desenvolvimento
  // Otimização de bundle
  webpack: (config, { dev, isServer }) => {
    // Otimizações para desenvolvimento
    if (dev) {
      config.watchOptions = {
        poll: 1000, // Polling mais rápido
        aggregateTimeout: 200, // Timeout menor
        ignored: /node_modules/, // Ignorar node_modules
      }
      
      // Otimizações para desenvolvimento mais rápido
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: {
          chunks: 'all',
          minSize: 10000,
          maxSize: 200000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Chunks menores para desenvolvimento
            common: {
              name: 'common',
              minChunks: 1,
              chunks: 'all',
              priority: 1,
              reuseExistingChunk: true,
            },
          },
        },
      }
      
      // Resolver mais rápido
      config.resolve.symlinks = false
      config.resolve.cache = false
    }
    
    if (!dev && !isServer) {
      // Otimizar para produção
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      }
    }
    return config
  },
  // Configurações de compilação
  swcMinify: true, // Habilitado para melhor performance
  // Configurações de cache otimizadas
  onDemandEntries: {
    maxInactiveAge: 30 * 1000, // 30 segundos
    pagesBufferLength: 2, // 2 páginas em buffer
  },
  // Otimizações de navegação
  trailingSlash: false,
  // Prefetching de rotas
  generateEtags: false,
}

module.exports = nextConfig
