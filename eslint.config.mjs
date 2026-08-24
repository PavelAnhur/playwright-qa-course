import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    // Base ESLint recommended rules
    eslint.configs.recommended,
    
    // TypeScript recommended rules (with type checking)
    ...tseslint.configs.recommendedTypeChecked,
    
    // Your custom configuration
    {
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json', // Explicit path
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // Add your custom rules here
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            "@typescript-eslint/no-unsafe-member-access": "info",
        },
    },
    {
        // Ignore certain files
        ignores: [
            'node_modules/**',
            'dist/**',
            'build/**',
            '*.config.js',
            '*.config.mjs',
        ],
    }
);
