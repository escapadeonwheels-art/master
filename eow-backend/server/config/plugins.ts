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

module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL/TLS for port 465
        auth: {
          user: env('GMAIL_USER'),
          pass: env('GMAIL_APP_PASSWORD'), // 16-character App Password
        },
      },
      settings: {
        defaultFrom: env('GMAIL_USER'),
        defaultReplyTo: env('GMAIL_USER'),
      },
    },
  },
});

module.exports = ({ env }) => ({
  // ... your other plugins ...
  'users-permissions': {
    config: {
      register: {
        allowedFields: ['firstName', 'lastName', 'avatarUrl'], // Allow Google profiles to pass metadata
      },
    },
  },
});


export default config;
