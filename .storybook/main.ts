import type { StorybookConfig } from '@storybook/nextjs';
import path from 'node:path';

const config: StorybookConfig = {
  stories: ['../**/*.mdx', '../**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-jest'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {},
  webpackFinal: async (config) => {
    config?.module?.rules?.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
    });

    if (config?.resolve?.alias) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/src': path.resolve(__dirname, '../src'),
      };
    }

    return config;
  },
};

export default config;
