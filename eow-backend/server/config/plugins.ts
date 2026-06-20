import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
    upload: {
    config: {
      provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
      providerOptions: {
        bucketName: env('GCP_BUCKET_NAME'), // Your Google Cloud Bucket Name
        publicFiles: env.bool('GCP_PUBLIC_FILES', true), // Makes files publicly accessible
        uniform: true,
        basePath: '',
      },
    },
  },
});

export default config;
