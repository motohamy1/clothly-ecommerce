import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    // Workers inherit NODE_ENV from the shell; force it here so React loads
    // its development build (the production build has no `act`).
    env: { NODE_ENV: 'test' },
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', 'backend/**', '.next/**'],
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
