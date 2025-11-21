import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Redireciona todas as rotas para index.html (fix para F5)
    historyApiFallback: true
  }
});
