import type { Core } from '@strapi/strapi';

export default ({ env }: { env: any }) => ({
  // 1. Google Cloud Storage Bucket Setup
  upload: {
    config: {
      provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
      providerOptions: {
        bucketName: env('GCP_BUCKET_NAME'), 
        publicFiles: env.bool('GCP_PUBLIC_FILES', true), 
        uniform: true,
        basePath: '',
      },
    },
  },

  // 2. Gmail Nodemailer SMTP Settings
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
          user: env('GMAIL_USER'),
          pass: env('GMAIL_APP_PASSWORD'), 
        },
      },
      settings: {
        defaultFrom: env('GMAIL_USER'),
        defaultReplyTo: env('GMAIL_USER'),
      },
    },
  },

  // 3. Whitelisted Metadata Security Layer
  'users-permissions': {
    config: {
      register: {
        allowedFields: ['firstName', 'lastName', 'avatarUrl'], 
      },
    },
  },
});
