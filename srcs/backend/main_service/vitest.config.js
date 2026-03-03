import {defineConfig} from 'vitest/config';
export default defineConfig({
    test : {
        globals: true,
        environment: 'node',
        coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        include: ['src/**/*.js'],
        exclude: ['src/config/**', 'generated/**', 'prisma/**'],
        thresholds: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        }
        },
        setupFiles: ['./tests/setup.js'],
  },
})