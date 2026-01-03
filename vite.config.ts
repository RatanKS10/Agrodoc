
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load all environment variables (including those not prefixed with VITE_)
  // Use (process as any).cwd() to resolve TypeScript type error while accessing the Node.js process environment
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    },
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});
