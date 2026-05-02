import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  // Important: always return the modified config
  return mergeConfig(config, {
    server: {
      allowedHosts: [
        'accuracy-mortician-uncured.ngrok-free.dev',
        '1337-my-project.gitpod.io'
      ],
      // Or use true to allow any host (less secure):
      // allowedHosts: true,
    },
  });
};