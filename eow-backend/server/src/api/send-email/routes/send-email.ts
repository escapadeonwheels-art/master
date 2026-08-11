export default {
  routes: [
    {
      method: 'POST',
      path: '/send-email',        // This maps cleanly to your /api/send-email path
      handler: 'send-email.send', // Calls the 'send' method inside your controller
      config: {
        auth: false,              // Allows the public to submit forms
      },
    },
  ],
};
