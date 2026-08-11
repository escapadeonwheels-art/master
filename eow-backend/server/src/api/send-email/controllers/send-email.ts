import { Core } from '@strapi/strapi';

export default {
  async send(ctx) {
    try {
      const { name, email, message } = ctx.request.body;

      if (!name || !email || !message) {
        return ctx.badRequest('Missing required form fields: name, email, or message.');
      }

      await strapi.plugin('email').service('email').send({
        to: process.env.GMAIL_USER, 
        from: process.env.GMAIL_USER,
        replyTo: email, 
        subject: `New Support Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <h3>Custom Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });

      return ctx.send({ success: true, message: 'Support email processed successfully!' });
    } catch (err: any) {
      strapi.log.error('Custom Send-Email Route Failure:', err);
      return ctx.internalServerError('The server failed to transmit your message.');
    }
  },
};
