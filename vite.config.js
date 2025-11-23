import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression';
export default defineConfig({
  plugins: [
    react(),
    compression({
        algorithm: 'gzip',
        threshold: 10240, // 大于10KB的文件才压缩
      })
  ],
  
  base: '/DailyUp/',
  build: {
    // 分割代码：按库拆分chunk，避免主包过大
    rollupOptions: {
      output: {
        manualChunks: {
          // 1. 图表相关：echarts + echarts-for-react（两者强关联，打包在一起）
          echarts: ['echarts', 'echarts-for-react'],
          // 2. 截图工具：html2canvas（体积较大，非首屏必需时单独拆）
          html2canvas: ['html2canvas'],
          // 3. 数据库SDK：supabase（后端请求相关，可单独拆）
          supabase: ['@supabase/supabase-js'],
          // 4. 日期工具：date-fns（体积中等，若全局使用可不拆，局部使用则拆）
          dateFns: ['date-fns'],
          // 5. React核心库（可选：若主包仍大，可拆分React相关）
          // react: ['react', 'react-dom'],
        }
      }
    },
    // 调整警告阈值（你的项目依赖较多，1000KB合理）
    chunkSizeWarningLimit: 1000,
    // 可选优化：启用压缩（vite默认开启，可明确配置）
    minify: 'esbuild',
    // 可选：生成sourcemap（生产环境是否需要调试用）
    sourcemap: false,
  }
})
