const config = {
  stories: ['../src/components/**/*.mdx', '../src/components/**/*.stories.@(js|jsx|ts|tsx)'],
  core: {},
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions', '@storybook/addon-mdx-gfm', {
    name: '@storybook/addon-styling',
    options: {
      // Check out https://github.com/storybookjs/addon-styling/blob/main/docs/api.md
      // For more details on this addon's options.
      postCss: true
    }
  }],
  docs: {
    autodocs: 'tag'
  },
  framework: {
    name: '@storybook/react-vite',
    options: {}
  }
};
export default config;